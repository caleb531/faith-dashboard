export class NextRequest extends Request {
  static _formData: FormData = new FormData();
  async formData() {
    return NextRequest._formData;
  }
}
export class NextResponse extends Response {
  // Match Next.js JSON serialization and preserve response headers
  static json(responseBody: unknown, init?: ResponseInit) {
    return new Response(JSON.stringify(responseBody), init);
  }
  static redirect(url: string, status?: number | undefined): Response {
    return new Response();
  }
}
