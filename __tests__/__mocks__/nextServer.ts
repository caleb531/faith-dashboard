export class NextRequest extends Request {
  static _formData: FormData = new FormData();
  async formData() {
    return NextRequest._formData;
  }
}
export class NextResponse extends Response {
  static async json(responseBody: ConstructorParameters<typeof Response>[0]) {
    return new Response(responseBody);
  }
}
