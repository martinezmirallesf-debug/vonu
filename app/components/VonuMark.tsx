type VonuMarkProps = {
  className?: string;
  framed?: boolean;
};

const OFFICIAL_VONU_PATH = "M 1308 240 L 1238 253 L 1162 288 L 1105 336 L 1065 391 L 1031 497 L 1031 552 L 1049 647 L 1043 701 L 1012 768 L 962 821 L 885 861 L 800 871 L 733 856 L 640 803 L 586 784 L 506 777 L 423 792 L 347 831 L 277 901 L 234 990 L 224 1090 L 247 1183 L 295 1261 L 372 1325 L 467 1360 L 546 1363 L 618 1346 L 688 1309 L 761 1248 L 823 1221 L 912 1216 L 988 1242 L 1044 1286 L 1086 1352 L 1100 1406 L 1100 1545 L 1124 1615 L 1157 1668 L 1212 1722 L 1275 1759 L 1336 1778 L 1414 1783 L 1513 1759 L 1565 1730 L 1615 1687 L 1676 1589 L 1692 1528 L 1695 1469 L 1676 1378 L 1626 1293 L 1543 1226 L 1441 1188 L 1397 1161 L 1357 1119 L 1328 1059 L 1320 967 L 1341 900 L 1391 835 L 1506 768 L 1569 704 L 1609 623 L 1622 519 L 1593 405 L 1526 315 L 1427 256 L 1368 242 Z";

export default function VonuMark({ className = "h-8 w-8" }: VonuMarkProps) {
  return (
    <svg viewBox="0 0 2000 2000" aria-hidden="true" className={`block shrink-0 ${className}`}>
      <defs>
        <linearGradient id="vonu-official-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#76B1FD" />
          <stop offset="1" stopColor="#6EACFB" />
        </linearGradient>
      </defs>
      <path d={OFFICIAL_VONU_PATH} fill="url(#vonu-official-blue)" />
    </svg>
  );
}
