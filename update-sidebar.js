const fs = require('fs');
let content = fs.readFileSync('src/components/layout/app-sidebar.tsx', 'utf8');

// 1. Add import
content = content.replace(
  'import { cn } from "@/lib/utils";',
  'import { cn } from "@/lib/utils";\nimport { getPendingOrdersCount } from "@/lib/actions/export-actions";'
);

// 2. Wrap navGroups inside the component and add state
content = content.replace(
  'const navGroups = [',
  `export function AppSidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    async function fetchCount() {
      const count = await getPendingOrdersCount();
      setPendingOrders(count);
    }
    fetchCount();
  }, []);

  const pathname = usePathname();

  const navGroups = [`
);

// 3. Update badge value
content = content.replace(
  'badge: "8"',
  'badge: pendingOrders > 0 ? pendingOrders.toString() : undefined'
);

// 4. Remove original component declaration
content = content.replace(
  `export function AppSidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();`,
  ''
);

fs.writeFileSync('src/components/layout/app-sidebar.tsx', content);
console.log('Done');
