#!/usr/bin/env python3
"""
Router Development Server
A Python-based local development server for the router admin interface.
Serves modified code from ./code directory and proxies API calls to the actual router.
"""

import http.server
import socketserver
import urllib.request
import urllib.parse
import urllib.error
import json
import os
import sys
import base64
import re
from http.cookies import SimpleCookie
import threading
import time


class RouterProxyHandler(http.server.SimpleHTTPRequestHandler):
    """
    Custom HTTP handler that serves files from ./code directory
    and proxies /goform requests to the actual router
    """

    # Router configuration
    ROUTER_IP = "192.168.150.1"
    ROUTER_BASE_URL = f"http://{ROUTER_IP}"

    def __init__(self, *args, **kwargs):
        # Serve files from ./code directory
        super().__init__(*args, directory="code", **kwargs)

    def do_GET(self):
        """Handle GET requests"""
        if self.path.startswith("/goform"):
            self.proxy_to_router("GET")
        else:
            # Serve static files from code directory
            super().do_GET()

    def do_POST(self):
        """Handle POST requests"""
        if self.path.startswith("/goform"):
            self.proxy_to_router("POST")
        else:
            self.send_error(404, "Not Found")

    def proxy_to_router(self, method):
        """Proxy requests to the actual router"""
        try:
            # Get request data for POST
            content_length = 0
            post_data = None
            if method == "POST":
                content_length = int(self.headers.get("Content-Length", 0))
                if content_length > 0:
                    post_data = self.rfile.read(content_length)

            # Build URL for router
            router_url = f"{self.ROUTER_BASE_URL}{self.path}"

            # Create request
            if method == "GET":
                req = urllib.request.Request(router_url)
            else:
                req = urllib.request.Request(router_url, data=post_data)

            # Forward headers (especially cookies for authentication)
            for header, value in self.headers.items():
                if header.lower() not in ["host", "content-length"]:
                    req.add_header(header, value)

            # Set proper User-Agent
            req.add_header(
                "User-Agent",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            )

            # Make request to router
            print(f"🔄 Proxying {method} {self.path} to router...")

            with urllib.request.urlopen(req, timeout=10) as response:
                # Get response data
                response_data = response.read()

                if self.path.find("sms_data_total") != -1:
                    try:
                        response_data = json.dumps(
                            self._clean_sms_data(response_data)
                        ).encode("utf-8")
                    except Exception as e:
                        print(f"❌ Error cleaning SMS data: {e}")
                        self.send_error(500, f"Internal Server Error: {str(e)}")

                # Send response back to client as usual
                self._send_response(response, response_data)
                # Log response for debugging
                if response_data:
                    try:
                        if self.path.find("sms_capacity") != -1:
                            json_data = json.loads(response_data.decode("utf-8"))
                            print(f"📱 SMS Capacity: {json_data}")
                        elif self.path.find("sms_cmd_status") != -1:
                            json_data = json.loads(response_data.decode("utf-8"))
                            print(f"📱 SMS Status: {json_data}")
                        elif self.path.find("loginfo") != -1:
                            json_data = json.loads(response_data.decode("utf-8"))
                            print(f"🔐 Login Status: {json_data}")
                    except:
                        pass

        except urllib.error.HTTPError as e:
            print(f"❌ Router error {e.code}: {e.reason}")
            self.send_error(e.code, e.reason)
        except urllib.error.URLError as e:
            print(f"❌ Connection error: {e.reason}")
            self.send_error(502, f"Bad Gateway - Router unreachable: {e.reason}")
        except Exception as e:
            print(f"❌ Proxy error: {str(e)}")
            self.send_error(500, f"Internal Server Error: {str(e)}")

    def _send_response(self, response, data):
        """Send HTTP response to client with headers and data."""
        self.send_response(response.getcode())
        for header, value in response.headers.items():
            self.send_header(header, value)
        self.end_headers()
        self.wfile.write(data)

    def _clean_sms_data(self, response_data):
        try:
            text_data = response_data.decode("utf-8", errors="replace")
            # Remove control characters that break JSON parsing
            import re

            # Remove null bytes, control characters except tab, newline, carriage return
            cleaned_data = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]", "", text_data)
            # Try parsing the cleaned data
            json_data = json.loads(cleaned_data)
            print(f"✅ Successfully cleaned and parsed router SMS data")
            print(
                f"📱 Router returned {len(json_data.get('messages', []))} SMS messages (cleaned)"
            )
            return json_data
        except json.JSONDecodeError as json_error:
            print(f"⚠️ JSON parsing failed even after cleaning: {json_error}")
            # Save problematic data for analysis
            with open("router_sms_debug.txt", "wb") as f:
                f.write(response_data)
            print(
                "💾 Saved problematic router response to 'router_sms_debug.txt' for analysis"
            )
            raise json_error

    def log_message(self, format, *args):
        """Custom logging"""
        if self.path.startswith("/goform"):
            print(f"🌐 {format % args}")
        else:
            print(f"📁 {format % args}")


class RouterAuthHelper:
    """Helper class for router authentication"""

    def __init__(self, router_ip="192.168.150.1"):
        self.router_ip = router_ip
        self.base_url = f"http://{router_ip}"
        self.session_cookies = ""

    def base64_encode(self, text):
        """Base64 encode string"""
        return base64.b64encode(text.encode("utf-8")).decode("utf-8")

    def login(self, username="admin", password="admin"):
        """Attempt to login to the router"""
        try:
            print(f"🔐 Attempting login to router {self.router_ip}...")

            # Prepare login data
            login_data = urllib.parse.urlencode(
                {
                    "isTest": "false",
                    "goformId": "LOGIN",
                    "password": self.base64_encode(password),
                    "username": self.base64_encode(username),
                }
            ).encode("utf-8")

            # Create request
            req = urllib.request.Request(
                f"{self.base_url}/goform/goform_set_cmd_process",
                data=login_data,
                headers={
                    "Content-Type": "application/x-www-form-urlencoded",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                },
            )

            # Make request
            with urllib.request.urlopen(req, timeout=10) as response:
                response_data = response.read().decode("utf-8")
                result = json.loads(response_data)

                # Extract cookies
                if "Set-Cookie" in response.headers:
                    self.session_cookies = response.headers["Set-Cookie"]

                # Check result
                if result.get("result") in ["0", "4"]:
                    print("✅ Login successful!")
                    return True
                else:
                    error_map = {
                        "1": "Login Fail",
                        "2": "Duplicate User",
                        "3": "Bad Password",
                        "5": "Bad Username",
                    }
                    error = error_map.get(result.get("result"), "Unknown error")
                    print(f"❌ Login failed: {error}")
                    return False

        except Exception as e:
            print(f"❌ Login error: {e}")
            return False

    def check_status(self):
        """Check login status"""
        try:
            params = urllib.parse.urlencode(
                {
                    "isTest": "false",
                    "cmd": "loginfo",
                    "multi_data": "1",
                    "_": str(int(time.time() * 1000)),
                }
            )

            req = urllib.request.Request(
                f"{self.base_url}/goform/goform_get_cmd_process?{params}",
                headers={
                    "Cookie": self.session_cookies,
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                },
            )

            with urllib.request.urlopen(req, timeout=5) as response:
                response_data = response.read().decode("utf-8")
                result = json.loads(response_data)
                is_logged_in = result.get("loginfo") == "ok"
                print(
                    f"🔍 Login status: {'✅ Logged in' if is_logged_in else '❌ Not logged in'}"
                )
                return is_logged_in

        except Exception as e:
            print(f"❌ Status check error: {e}")
            return False


def main():
    """Main server function"""
    PORT = 8080

    # Check if code directory exists
    if not os.path.exists("code"):
        print("❌ Error: 'code' directory not found!")
        print("Please ensure the router source files are in the './code' directory")
        sys.exit(1)

    print("🚀 Router Development Server")
    print("=" * 50)
    print(f"📂 Serving files from: ./code")
    print(f"🌐 Local URL: http://localhost:{PORT}")
    print(f"🔗 Router IP: {RouterProxyHandler.ROUTER_IP}")
    print("=" * 50)

    # Optional: Try to authenticate with router
    print("\n🔐 Testing router connection...")
    auth = RouterAuthHelper()
    if auth.login():
        auth.check_status()
    else:
        print("⚠️  Router authentication failed, but server will still run")
        print("💡 You can login manually through the web interface")

    print(f"\n🎯 Starting server on port {PORT}...")
    print("💡 Tip: Access http://localhost:8080 to view the router interface")
    print("🛑 Press Ctrl+C to stop the server\n")

    # Start server
    try:
        with socketserver.TCPServer(("", PORT), RouterProxyHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {e}")


if __name__ == "__main__":
    main()
