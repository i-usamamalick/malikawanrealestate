import Hero from "../components/common/Hero";
import PropertyGrid from "../components/common/PropertyGrid";

const Home = () => {
  return (
    <>
      <Hero />
      <div className="card mb-60">
        <PropertyGrid />
      </div>
    </>
  );
};

export default Home;
