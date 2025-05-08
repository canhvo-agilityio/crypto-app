import { CryptoBase } from "@/types";
import CryptoCard from "../CryptoCard";

interface CryptoListProps {
  data: CryptoBase[];
}

const CryptoList = ({data}: CryptoListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.map((item) => (
        <CryptoCard
          key={item.id}
          id={item.id}
          name={item.name}
          symbol={item.symbol}
          price={item.price}
          changePercent={item.changePercent}
          iconUrl={item.iconUrl}
        />
      ))}
    </div>
  );
}

export default CryptoList;