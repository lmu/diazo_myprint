from diazo.wsgi import DiazoMiddleware
from diazo.wsgi import XSLTMiddleware
from webob import Request

class HelperXSLTMiddleware(XSLTMiddleware):
    def __call__(self, environ, start_response):
        request = Request(environ)
        if (request.method != "GET"):
            return self.app(environ, start_response)
        return super().__call__(environ, start_response)

class HelperDiazoMiddleware(DiazoMiddleware):
    
    def get_transform_middleware(self):
        return HelperXSLTMiddleware(
            self.app,
            self.global_conf,
            tree=self.compile_theme(),
            read_network=self.read_network,
            read_file=self.read_file,
            update_content_length=self.update_content_length,
            ignored_extensions=self.ignored_extensions,
            environ_param_map=self.environ_param_map,
            doctype=self.doctype,
            content_type=self.content_type,
            unquoted_params=self.unquoted_params,
            **self.params  # NOQA: C815,S101
        )