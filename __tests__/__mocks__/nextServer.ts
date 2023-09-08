export class NextRequest extends Request {
  static _formData: FormData = new FormData();
  async formData() {
    return NextRequest._formData;
  }
}
export class NextResponse extends Response {
  static json(responseBody: ConstructorParameters<typeof Response>[0]) {
    return new Response(responseBody);
  }
  static redirect(url: string, status?: number | undefined): Response {
    return new Response();
  }
}
