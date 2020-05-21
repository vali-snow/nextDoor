using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models.Enums
{
    public enum ActivityType
    {
        AccountCreate,
        AccountUpdate,
        ProductCreate,
        ProductEdit,
        ProductRemove,
        OrderPlace,
        OrderReveive,
        OrderFulfill,
        OrderCancel
    }
}
