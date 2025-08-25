const brands = [
  { id: '1', name: 'ХРУТКА', image: '/brands/hrutka.png', description: 'Өглөөний хоол' },
  { id: '2', name: 'СЛОБОДА', image: '/brands/sloboda.png', description: 'Ургамлын тос' },
  { id: '3', name: 'ARIEL', image: '/brands/ariel.png', description: 'Угаалгын нунтаг' },
  { id: '4', name: 'TIDE', image: '/brands/tide.png', description: 'Угаалгын нунтаг' },
  { id: '5', name: 'SAFEGUARD', image: '/brands/safeguard.png', description: 'Саван' },
  { id: '6', name: 'H&S', image: '/brands/hs.png', description: 'Шампунь' },
  { id: '7', name: 'PANTENE', image: '/brands/pantene.png', description: 'Шампунь' },
  { id: '8', name: 'FAIRY', image: '/brands/fairy.png', description: 'Аяга таваг угаагч' },
];

export function BrandList() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
      {brands.map((brand) => (
        <div
          key={brand.id}
          className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
        >
          <img
            src={brand.image}
            alt={brand.name}
            className="w-20 h-20 object-contain mb-2"
          />
          <h3 className="text-sm font-medium text-center">{brand.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">{brand.description}</p>
        </div>
      ))}
    </div>
  );
}