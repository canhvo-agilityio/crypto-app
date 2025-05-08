import { Banner, CryptoList } from "@/components";
import { useTrendingCoins } from "@/hooks";

const Home = () => {  
  const {coins} = useTrendingCoins();
  return (
    <div className="px-6 md:px-20 py-8 flex flex-col gap-8">
      <Banner />
      <CryptoList
        data={coins}
      />
    </div>
  );
}
export default Home;