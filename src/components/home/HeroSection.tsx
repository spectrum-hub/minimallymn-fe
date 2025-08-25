import { MainHeroSlider } from "./MainHeroSlider";
import { FacebookLiveSlider } from "./FacebookLiveSlider";

export function HeroSection() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="col-span-2 ">
          <MainHeroSlider />
        </div>
        <FacebookLiveSlider />
      </div>
    </section>
  );
}
