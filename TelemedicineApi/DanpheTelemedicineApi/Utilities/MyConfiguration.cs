using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DanpheTelemedicineAPI.Core.Configuration
{
    public class MyConfiguration
    {
        public MyConfiguration()
        {

        }
        public string connStringTelemedicine { get; set; }
        public int CacheExpirationMinutes { get; set; }
        public string FileStorageRelativeLocation { get; set; }
        public bool RealTimeRemoteSyncEnabled { get; set; }
        public string ApplicationVersionNum { get; set; }
        public string CorsOriginUrlList { get; set; }
    }
   
}
