export const CartCounter = () => {
  return (
    <a href="/cart" className="relative inline-block">
      <span className="absolute -top-2 -right-2 flex justify-center items-center bg-blue-600 text-white text-xs rounded-full w-5 h-5">
        3
      </span>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.5em"
        height="1.5em"
        viewBox="0 0 24 24"
      >
        <g fill="none" stroke="currentColor" strokeWidth={1}>
          <circle cx={10} cy={19} r={1.5}></circle>
          <circle cx={17} cy={19} r={1.5}></circle>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.5 4h2l3.504 11H17"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.224 12.5L6.3 6.5h12.507a.5.5 0 0 1 .475.658l-1.667 5a.5.5 0 0 1-.474.342z"
          ></path>
        </g>
      </svg>
    </a>
  );
};
