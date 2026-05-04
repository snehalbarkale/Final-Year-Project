const FighterBackground = ({ leftImage, rightImage }) => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[15%] -rotate-[10deg] hidden md:block"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/80 z-10" />
          <img
            src={leftImage}
            alt=""
            loading="lazy"
            width={1024}
            height={1024}
            className="w-[300px] lg:w-[400px] object-cover opacity-60 brightness-110 contrast-110 drop-shadow-lg"
          />
        </div>
      </div>

      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[15%] rotate-[10deg] hidden md:block"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-background/80 z-10" />
          <img
            src={rightImage}
            alt=""
            loading="lazy"
            width={1024}
            height={1024}
            className="w-[300px] lg:w-[400px] object-cover opacity-60 brightness-110 contrast-110 drop-shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default FighterBackground;
