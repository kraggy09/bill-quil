const RequestShimmer = () => {
  return (
    <div className="min-w-[100%]   flex flex-col">
      <div className="min-w-[90%]   bg-gray-400 animate-pulse my-3 min-h-[30px] rounded-xl mx-6 "></div>
      {Array(3)
        .fill("")
        .map((i, index) => {
          return (
            <div className="min-w-full flex justify-around " key={index}>
              <div className="min-w-[10vw]  bg-gray-400 animate-pulse text-gray-400 my-3 min-h-[30px] rounded-xl">
                a
              </div>
              <div className="min-w-[50%]   bg-gray-400 animate-pulse my-3 min-h-[30px] rounded-xl"></div>
              <div className="min-w-[20%]  bg-gray-400 animate-pulse my-3 min-h-[30px] rounded-xl"></div>
            </div>
          );
        })}
    </div>
  );
};

export default RequestShimmer;
