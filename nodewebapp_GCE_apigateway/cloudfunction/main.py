import json
import logging

from flask import Flask, request

app = Flask(__name__)


CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Max-Age": "3600",
}


@app.route("/hello", methods=["POST", "OPTIONS"])
def hello(request):

    if hasattr(request, "method") and request.method == "OPTIONS":
        return ("", 200, CORS_HEADERS)

    prop = request.get_json()

    if (
        hasattr(request, "headers")
        and "content-type" in request.headers
        and request.headers["content-type"] != "application/json"
    ):
        return (
            json.dumps({"error": f"Unknown content type: {ct}!"}),
            400, CORS_HEADERS
        )

    if prop is None:
        return (
            json.dumps({"error": "No request parameters passed!"}),
            400, CORS_HEADERS
        )

    name = prop["name"]

    return (json.dumps({"text": f"Hello {name}"}), 200, CORS_HEADERS)


if __name__ == "__main__":
    print("Running from the command line...")
