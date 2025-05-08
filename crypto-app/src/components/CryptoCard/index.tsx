import { ROUTERS } from "@/constants";
import { CryptoBase } from "@/types";
import { useNavigate } from "react-router";


const CryptoCard = ({ id, name, symbol, price, changePercent, iconUrl }: CryptoBase) => {
  const isPositive = changePercent >= 0;
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(ROUTERS.COIN_PARAM + id)
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-xl shadow bg-white" onClick={handleClick}>
      <div className="flex items-center gap-4">
        <img
          src={iconUrl}
          alt={name}
          className="w-10 h-10 rounded-full object-contain"
        />
        <div>
          <div className="text-sm font-semibold text-gray-800">{name}</div>
          <div className="text-xs font-medium text-red-500">{symbol}</div>
        </div>
      </div>

      <div className="text-right">
        <div className="text-sm font-semibold text-gray-800">{`$ ${price}`}</div>
        <div className={`text-xs font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? "+" : ""}
          {changePercent.toFixed(2)}%
        </div>
      </div>
    </div>
  );
}

export default CryptoCard;