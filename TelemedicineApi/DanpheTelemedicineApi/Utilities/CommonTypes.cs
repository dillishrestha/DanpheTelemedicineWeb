namespace DanpheTelemedicineAPI.CommonTypes
{
    public class DanpheHTTPResponse<T>
    {
        public T Results { get; set; }
        public string Status { get; set; }
        public string ErrorMessage { get; set; }

        public DanpheHTTPResponse()
        {
            this.Status = string.Empty;
            this.ErrorMessage = string.Empty;
        }

        public static DanpheHTTPResponse<T> FormatResult(T results)
        {
            return new DanpheHTTPResponse<T>() { Results = results };
        }

        public static DanpheHTTPResponse<T> FormatResult(T results, string status)
        {
            return new DanpheHTTPResponse<T>() { Status = status, Results = results };
        }

        public static DanpheHTTPResponse<T> FormatResult(T results, string status, string errorMessage)
        {
            return new DanpheHTTPResponse<T>() { Status = status, Results = results, ErrorMessage = errorMessage };
        }

    }
}
