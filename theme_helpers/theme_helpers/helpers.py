import paste.proxy as proxy


class NoCSPProxy(proxy.Proxy):
    def __init__(self, *args, suppress_http_response_headers=(), **kwargs):
        super().__init__(*args, **kwargs)
        self.suppress_http_response_headers = [
            x.lower() for x in suppress_http_response_headers if x
        ]

    def __call__(self, environ, start_response):
        def wrap_start_response(status, headers, **kwargs):
            clean_headers = [
                (name, value)
                for name, value in headers
                if name.lower() not in self.suppress_http_response_headers
            ]
            return start_response(status, clean_headers, **kwargs)

        resp = super().__call__(environ, wrap_start_response)
        return resp


def make_proxy_helper(
    _,
    address,
    allowed_request_methods="",
    suppress_http_headers="",
    suppress_http_response_headers="",
):
    allowed_request_methods = proxy.aslist(allowed_request_methods)
    suppress_http_headers = proxy.aslist(suppress_http_headers)
    suppress_http_response_headers = proxy.aslist(suppress_http_response_headers)
    return NoCSPProxy(
        address,
        allowed_request_methods=allowed_request_methods,
        suppress_http_headers=suppress_http_headers,
        suppress_http_response_headers=suppress_http_response_headers,
    )
