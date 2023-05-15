export interface TabSelectorProps {
  selectedTab: number | string;
  onSelectTab: (selectedTabId: number | string) => void;
}

export function TabSelector({ selectedTab, onSelectTab }: TabSelectorProps) {
  return (
    <div className="border-[1px] w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition">
      <div className="flex flex-row items-center justify-between">
        <button
          type="button"
          onClick={() => onSelectTab(0)}
          className={[
            'text-sm px-8 border-r-[1px]',
            selectedTab === 0 ? 'font-semibold' : 'text-gray-600',
          ].join(' ')}
        >
          Buy NFTs
        </button>
        <button
          type="button"
          onClick={() => onSelectTab(1)}
          className={[
            'text-sm px-8',
            selectedTab === 1 ? 'font-semibold' : 'text-gray-600',
          ].join(' ')}
        >
          <div className="hidden sm:block">Sell NFTs</div>
        </button>
      </div>
    </div>
  );
}
