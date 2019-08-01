
export class GlobalService {
  public isUserLoggedin = false;
  public loggedUserInfo: any;
  public callType: string;
  public caller: any;
  public messgaes = new Array<{
    Message: string,
    Type: string,
    Sender: string,
    Date: string
  }>();
  public sessionid: any;
  public sessionUserDbId: any;
  constructor() {

  }

  /**
   * Download any file
   */
  public DownloadDoc(fileName, base64data) {
    try {
      const blob = this.b64toBlob(base64data);
      const blobUrl = URL.createObjectURL(blob);

      var element = document.createElement('a');
      element.setAttribute('href', blobUrl);
      element.setAttribute('download', fileName);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();
      document.body.removeChild(element);
    } catch (ex) {
      console.log(ex);
    }
  }
  private b64toBlob(b64Data) {
    var contentType = '', sliceSize = 512
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}