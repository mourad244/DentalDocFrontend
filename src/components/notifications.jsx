import React, { useEffect, useState } from "react";
import { getLowStockItems } from "../services/pharmacie/articleService";
import { truncateString } from "../utils/truncateString";

const Notifications = React.forwardRef((props, ref) => {
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const { data: items } = await getLowStockItems();
      setLowStockItems(items);
    };
    fetchAlerts();
  }, []);

  return (
    <div
      ref={ref}
      className="absolute ml-4 mt-16 flex h-fit w-44 flex-col rounded-lg bg-[#4e6e79] shadow-md"
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-2">
          <h1 className="text-base font-bold text-white">Notifications</h1>
        </div>
        <div className="bt-1 flex flex-col px-2 ">
          <h1 className="text-sm font-bold text-white">Stock bas</h1>
          <ul>
            {lowStockItems.map((item) => (
              <li key={item._id} className="my-2">
                <p className="text-xs font-medium text-white">{`${truncateString(
                  item.nom,
                  20,
                )} (${item.stockActuel}/${item.stockAlerte})`}</p>
                <div className="h-[1px] bg-[#365f6d]" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
});

export default Notifications;
