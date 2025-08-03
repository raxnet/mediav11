export default function LanguageSwitcher({ locale, setLocale }) {
  return (
    <select
      className="bg-blue-50 dark:bg-gray-700 px-2 py-1 rounded border-none focus:ring-blue-400"
      value={locale}
      onChange={e => setLocale(e.target.value)}
    >
      <option value="id">🇮🇩 Indonesia</option>
      <option value="en">🇬🇧 English</option>
    </select>
  );
}