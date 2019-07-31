using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DanpheTelemedicineApi.ServerModel
{
    public class SessionDocumentsModel
    {
        [Key]
        public int SessionDocumentId { get; set; }
        public string SessionId { get; set; }
        public int UploadedBy { get; set; }
        public string UploadedOn { get; set; }
        public bool? IsRead { get; set; }
        public string FileName { get; set; }
        public byte[] FileByteArray { get; set; }
        public string FileExtension { get; set; }

        [NotMapped]
        public string UploaderName { get; set; }
    }
}
