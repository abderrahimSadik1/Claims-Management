
function Hero() {
  return (
    <section className="bg-white dark:bg-base-100">
      <div className="grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28">
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1 className="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl">
            Claims <br /> Management.
          </h1>

          <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">Our website provides a platform for users to submit claims for managers to review and approve. Its designed to streamline the process of claim submission and approval, facilitating efficient management and resolution. </p>
            <a href="/register" className=" px-5 py-3 text-sm font-medium text-center btn btn-primary border border-gray-200 rounded-lg sm:w-auto hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-blue-700 dark:focus:ring-gray-800">
              Get Started
            </a>
        </div>

        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
          <img src="https://demo.themesberg.com/landwind/images/hero.png" alt="hero image" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
