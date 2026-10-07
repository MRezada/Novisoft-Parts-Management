# Novisoft Parts Management Frontend v1.2.0

Frontend prototype for Novisoft Parts Management System.

## Run

```powershell
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:5173`.

## Demo login

- Username: `admin`
- Password: `reza@1382`

> Demo-only frontend authentication. Replace with ASP.NET Core API + AD/LDAP + JWT before production.

## Included

- Novisoft branded modern RTL UI
- Animated login page
- Dashboard with KPI cards and activity panels
- Working notification dropdown + read-all action
- Toast notifications
- Parts / Groups / Subgroups tabs
- Automatic part code preview: `Group.Subgroup.Sequence`
- Automatic system ID preview: `PF-XXXXXXXX`
- Inventory and locations
- Movements
- Production consumption
- Reports placeholders prepared for Power BI
- Users / roles page prepared for AD/LDAP
- Settings / system health page
- Responsive layout
- React + TypeScript + Vite + Lucide React

The API contract remains in `src/services.ts` and is ready to connect to ASP.NET Core.


## v1.4.3 Dashboard
- Refined RTL dashboard composition based on the approved Novisoft visual reference.
- Welcome panel aligned to the right, date card to the left.
- Larger Novisoft logo and curved sidebar header treatment.
- Cleaner blue/cyan/violet palette with restrained gradients.
- Stronger card separation and subtle section accents.
- Responsive and dark-mode refinements.
