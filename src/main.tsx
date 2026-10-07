import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  AlertTriangle, ArrowDownToLine, ArrowLeftRight, ArrowUpFromLine, BarChart3, Bell,
  Boxes, CheckCircle2, ChevronDown, ChevronLeft, ClipboardList, Eye, Factory, FileBarChart,
  FileText, LayoutDashboard, LogIn, LogOut, MapPin, Menu, MoreHorizontal, PackageCheck,
  PackageMinus, Plus, RefreshCw, Search, Settings, ShieldCheck, SlidersHorizontal, Trash2,
  Truck, UserCog, Users, Warehouse, X, Edit3, KeyRound, LockKeyhole, Sparkles, Activity,
  CircleHelp, Database, Zap, Check, Info, UserPlus, Moon, Sun, Save, Shield, Pencil
} from 'lucide-react'
import { parts as seedParts, movements as seedMovements, groups as seedGroups, subgroups as seedSubgroups } from './data/mock'
import type { Part, PartGroup, Subgroup } from './types'
import './styles.css'

type Page = 'dashboard'|'parts'|'inventory'|'movements'|'production'|'reports'|'users'|'settings'
type Toast = { id:number; text:string; tone:'success'|'info'|'danger' }
type NotificationItem = { id:number; title:string; text:string; time:string; tone:'danger'|'success'|'info' }
type AppUser = { id:number; username:string; name:string; role:string; status:'فعال'|'غیرفعال'; lastLogin:string }
type PermissionKey = 'manageParts'|'manageCatalog'|'manageInventory'|'manageUsers'|'viewReports'
const permissionLabels: Record<PermissionKey,string> = { manageParts:'مدیریت قطعات', manageCatalog:'مدیریت گروه و زیرگروه', manageInventory:'مدیریت انبار و گردش', manageUsers:'مدیریت کاربران', viewReports:'مشاهده گزارش‌ها' }

const nav: {id:Page; label:string; icon:React.ElementType; hint:string}[] = [
  {id:'dashboard',label:'داشبورد',icon:LayoutDashboard,hint:'نمای کلی سامانه'},
  {id:'parts',label:'قطعات',icon:Boxes,hint:'کاتالوگ و کدگذاری'},
  {id:'inventory',label:'انبار و مکان',icon:Warehouse,hint:'موجودی و موقعیت'},
  {id:'movements',label:'ورود، خروج و انتقال',icon:ArrowLeftRight,hint:'گردش قطعات'},
  {id:'production',label:'تولید و مصرف',icon:Factory,hint:'خطوط و ماشین‌آلات'},
  {id:'reports',label:'گزارش‌ها',icon:BarChart3,hint:'گزارش‌های مدیریتی'},
]
const systemNav: {id:Page; label:string; icon:React.ElementType; hint:string}[] = [
  {id:'users',label:'کاربران و دسترسی',icon:Users,hint:'نقش‌ها و مجوزها'},
  {id:'settings',label:'تنظیمات',icon:Settings,hint:'تنظیمات سامانه'},
]

const notificationsSeed: NotificationItem[] = [
  {id:1,title:'موجودی بحرانی',text:'کاسه نمد 35×52 موجودی صفر دارد.',time:'۲ دقیقه پیش',tone:'danger'},
  {id:2,title:'ورود جدید',text:'۲۰ عدد فیلتر روغن وارد انبار شد.',time:'۳۸ دقیقه پیش',tone:'success'},
  {id:3,title:'انتقال به تولید',text:'۵ عدد بلبرینگ 6205 به خط تولید ۲ منتقل شد.',time:'۱ ساعت پیش',tone:'info'},
]

function App(){
  const [authenticated,setAuthenticated] = useState(false)
  if (!authenticated) return <Login onLogin={()=>setAuthenticated(true)} />
  return <Shell onLogout={()=>setAuthenticated(false)} />
}

function Login({onLogin}:{onLogin:()=>void}){
  const [user,setUser] = useState('')
  const [password,setPassword] = useState('')
  const [show,setShow] = useState(false)
  const [error,setError] = useState('')
  const submit = (e:React.FormEvent)=>{
    e.preventDefault()
    if(user.trim().toLowerCase()==='admin' && password==='reza@1382') onLogin()
    else setError('نام کاربری یا رمز عبور صحیح نیست.')
  }
  return <div className="login-page" dir="rtl">
    <div className="login-orb orb-one"/><div className="login-orb orb-two"/><div className="login-grid"/>
    <div className="login-shell">
      <section className="login-showcase">
        <div className="login-brand"><BrandLogo light/><span>سامانه مدیریت قطعات سازمانی</span></div>
        <div className="showcase-copy">
          <span className="glass-badge"><Sparkles size={14}/> نسل جدید مدیریت قطعات</span>
          <h1>همه‌چیز درباره قطعات،<br/><strong>شفاف، سریع و دقیق.</strong></h1>
          <p>کنترل کدگذاری، انبار، مکان، گردش و مصرف قطعات در یک محیط حرفه‌ای و یکپارچه.</p>
        </div>
        <div className="login-highlights">
          <div><ShieldCheck size={18}/><span><b>کنترل دسترسی</b><small>نقش و مجوز برای هر کاربر</small></span></div>
          <div><Activity size={18}/><span><b>ردیابی لحظه‌ای</b><small>تاریخچه کامل ورود و خروج</small></span></div>
          <div><Database size={18}/><span><b>آماده اتصال به API</b><small>ساخته‌شده برای ASP.NET Core</small></span></div>
        </div>
      </section>
      <section className="login-card-wrap">
        <div className="login-card">
          <div className="mobile-brand"><BrandLogo/><span>Novisoft</span></div>
          <div className="login-card-head"><div className="login-icon"><LockKeyhole size={23}/></div><div><h2>ورود به سامانه</h2><p>برای ادامه وارد حساب کاربری خود شوید</p></div></div>
          <form onSubmit={submit}>
            <label>نام کاربری</label>
            <div className="field"><UserCog size={17}/><input value={user} onChange={e=>setUser(e.target.value)} placeholder="نام کاربری را وارد کنید" autoComplete="username"/></div>
            <label>رمز عبور</label>
            <div className="field"><KeyRound size={17}/><input value={password} onChange={e=>setPassword(e.target.value)} type={show?'text':'password'} placeholder="رمز عبور را وارد کنید" autoComplete="current-password"/><button type="button" className="field-action" onClick={()=>setShow(x=>!x)}>{show?<Eye size={16}/>:<Eye size={16}/>}</button></div>
            <div className="login-options"><label className="remember"><input type="checkbox" defaultChecked/> <span>مرا به خاطر بسپار</span></label><button type="button">بازیابی رمز</button></div>
            {error && <div className="login-error"><AlertTriangle size={15}/>{error}</div>}
            <button className="login-submit" type="submit"><span>ورود به سامانه</span><LogIn size={18}/></button>
          </form>
          <div className="login-security"><ShieldCheck size={15}/><span>اتصال امن و مدیریت‌شده توسط Novisoft</span></div>
        </div>
        <small className="login-version">Novisoft Parts Management • v1.3.0</small>
      </section>
    </div>
  </div>
}

function BrandLogo({light=false}:{light?:boolean}){
  return <div className={`brand-logo image-brand ${light?'light':''}`} aria-label="Novisoft">
    <img src="/novisoft-logo.png" alt="Novisoft"/>
    <div className="brand-word"><b>Novisoft</b><small>نرم‌افزار سازمانی</small></div>
  </div>
}

const defaultUsers: AppUser[] = [
  {id:1,username:'admin',name:'مدیر سیستم',role:'Administrator',status:'فعال',lastLogin:'امروز 07:44'},
  {id:2,username:'warehouse',name:'انباردار مرکزی',role:'انباردار',status:'فعال',lastLogin:'امروز 07:38'},
  {id:3,username:'production',name:'کارشناس تولید',role:'تولید',status:'فعال',lastLogin:'امروز 07:21'},
  {id:4,username:'manager',name:'مدیر کارخانه',role:'مدیریت',status:'فعال',lastLogin:'دیروز 16:10'},
]

function Shell({onLogout}:{onLogout:()=>void}){
  const [page,setPage] = useState<Page>('dashboard')
  const [sidebar,setSidebar] = useState(true)
  const [query,setQuery] = useState('')
  const [showPartModal,setShowPartModal] = useState(false)
  const [showNotifications,setShowNotifications] = useState(false)
  const [notifications,setNotifications] = useState(notificationsSeed)
  const [toasts,setToasts] = useState<Toast[]>([])
  const [parts,setParts] = useState<Part[]>(seedParts)
  const [groups,setGroups] = useState<PartGroup[]>(seedGroups)
  const [subgroups,setSubgroups] = useState<Subgroup[]>(seedSubgroups)
  const [movements,setMovements] = useState(seedMovements)
  const [users,setUsers] = useState<AppUser[]>(defaultUsers)
  const [darkMode,setDarkMode] = useState(()=>localStorage.getItem('novisoft-theme-selected')==='1' && localStorage.getItem('novisoft-dark')==='1')
  const [permissions,setPermissions] = useState<Record<PermissionKey,boolean>>({manageParts:true,manageCatalog:true,manageInventory:true,manageUsers:true,viewReports:true})
  const [showUserModal,setShowUserModal] = useState(false)

  useEffect(()=>{document.documentElement.classList.toggle('dark-mode',darkMode);localStorage.setItem('novisoft-dark',darkMode?'1':'0')},[darkMode])
  const toggleTheme = (next:boolean) => { localStorage.setItem('novisoft-theme-selected','1'); setDarkMode(next) }
  const notify = (text:string,tone:Toast['tone']='success') => { const id=Date.now(); setToasts(t=>[...t,{id,text,tone}]); window.setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3500) }
  const addPart = (part:Part) => { setParts(p=>[part,...p]); setShowPartModal(false); notify('قطعه جدید با موفقیت ثبت شد.') }
  const addGroup = (g:PartGroup) => {setGroups(x=>[...x,g]);notify(`گروه «${g.name}» اضافه شد.`)}
  const updateGroup = (g:PartGroup) => {setGroups(x=>x.map(y=>y.id===g.id?g:y));setParts(x=>x.map(p=>p.groupId===g.id?{...p,group:g.name}:p));notify('گروه بروزرسانی شد.')}
  const deleteGroup = (id:number) => {if(subgroups.some(s=>s.groupId===id)||parts.some(p=>p.groupId===id)){notify('این گروه دارای زیرگروه یا قطعه است و قابل حذف نیست.','danger');return}setGroups(x=>x.filter(g=>g.id!==id));notify('گروه حذف شد.','info')}
  const addSubgroup = (s:Subgroup) => {setSubgroups(x=>[...x,s]);notify(`زیرگروه «${s.name}» اضافه شد.`)}
  const updateSubgroup = (s:Subgroup) => {setSubgroups(x=>x.map(y=>y.id===s.id?s:y));setParts(x=>x.map(p=>p.subgroupId===s.id?{...p,subgroup:s.name}:p));notify('زیرگروه بروزرسانی شد.')}
  const deleteSubgroup = (id:number) => {if(parts.some(p=>p.subgroupId===id)){notify('این زیرگروه دارای قطعه است و قابل حذف نیست.','danger');return}setSubgroups(x=>x.filter(s=>s.id!==id));notify('زیرگروه حذف شد.','info')}
  const pageTitle = [...nav,...systemNav].find(x=>x.id===page)?.label ?? 'داشبورد'
  const unread = notifications.length
  const clearNotifications = ()=>{setNotifications([]);notify('اعلان‌ها خوانده شدند.','info')}
  const canCatalog = permissions.manageCatalog

  return <div className="app" dir="rtl">
    <aside className={`sidebar ${sidebar?'':'collapsed'}`}>
      <div className="brand-area"><BrandLogo/>{sidebar && <button className="sidebar-collapse" onClick={()=>setSidebar(false)}><ChevronLeft size={15}/></button>}</div>
      <div className="nav-title">منوی اصلی</div>
      {nav.map(({id,label,icon:Icon,hint})=><button key={id} className={`nav-item ${page===id?'active':''}`} onClick={()=>setPage(id)} title={!sidebar?label:hint}><Icon size={19}/>{sidebar&&<><span>{label}</span>{page===id&&<i/>}</>}</button>)}
      <div className="nav-title">مدیریت سامانه</div>
      {systemNav.map(({id,label,icon:Icon,hint})=><button key={id} className={`nav-item ${page===id?'active':''}`} onClick={()=>setPage(id)} title={!sidebar?label:hint}><Icon size={19}/>{sidebar&&<><span>{label}</span>{page===id&&<i/>}</>}</button>)}
      <div className="sidebar-spacer"/>
      <div className="server-status"><span className="status-pulse"/><div>{sidebar&&<><b>سامانه آنلاین</b><small>Backend آماده اتصال</small></>}</div></div>
      {sidebar && <div className="sidebar-user"><div className="avatar">A</div><div><b>مدیر سیستم</b><small>Administrator</small></div><button onClick={onLogout} title="خروج"><LogOut size={15}/></button></div>}
    </aside>
    <main className={`main ${sidebar?'':'wide'}`}>
      <header className="topbar">
        <div className="top-title"><button className="icon-btn menu-toggle" onClick={()=>setSidebar(x=>!x)}><Menu size={20}/></button><div><div className="eyebrow">NOVISOFT • PARTS MANAGEMENT</div><h1>{pageTitle}</h1></div></div>
        <div className="top-actions">
          <div className="search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="جستجوی قطعه، کد یا مکان..."/><kbd>Ctrl K</kbd></div>
          <div className="notification-wrap"><button className={`icon-btn notification ${unread?'has-unread':''}`} onClick={()=>setShowNotifications(x=>!x)}><Bell size={19}/>{unread>0&&<span className="notification-count">{unread}</span>}</button>{showNotifications&&<NotificationPanel items={notifications} onClear={clearNotifications} onClose={()=>setShowNotifications(false)}/>}</div>
          <button className="icon-btn theme-toggle" onClick={()=>toggleTheme(!darkMode)} title={darkMode?'حالت روشن':'حالت تاریک'}>{darkMode?<Sun size={18}/>:<Moon size={18}/>}</button>
          <div className="user"><div className="avatar">A</div><div><b>مدیر سیستم</b><small>Administrator</small></div><ChevronDown size={14}/></div>
        </div>
      </header>
      <div className="content"><div className="page-animate" key={page}>
        {page==='dashboard' && <Dashboard setPage={setPage} movements={movements}/>} 
        {page==='parts' && <Parts parts={parts} groups={groups} subgroups={subgroups} query={query} canCatalog={canCatalog} onAdd={()=>setShowPartModal(true)} onDelete={(id)=>{setParts(p=>p.filter(x=>x.id!==id));notify('قطعه حذف شد.','info')}} onEdit={(part)=>notify(`ویرایش ${part.name} در نسخه API فعال می‌شود.`,'info')} onAddGroup={addGroup} onUpdateGroup={updateGroup} onDeleteGroup={deleteGroup} onAddSubgroup={addSubgroup} onUpdateSubgroup={updateSubgroup} onDeleteSubgroup={deleteSubgroup} />}
        {page==='inventory' && <Inventory parts={parts}/>} {page==='movements' && <Movements movements={movements}/>} {page==='production' && <Production/>} {page==='reports' && <Reports notify={notify}/>} 
        {page==='users' && <UsersPage users={users} onAdd={()=>setShowUserModal(true)} onToggle={(id)=>setUsers(x=>x.map(u=>u.id===id?{...u,status:u.status==='فعال'?'غیرفعال':'فعال'}:u))} notify={notify}/>} 
        {page==='settings' && <SettingsPage darkMode={darkMode} setDarkMode={toggleTheme} permissions={permissions} setPermissions={setPermissions} notify={notify}/>} 
      </div></div>
    </main>
    {showPartModal && <PartModal groups={groups} subgroups={subgroups} parts={parts} onClose={()=>setShowPartModal(false)} onSave={addPart}/>} 
    {showUserModal && <UserModal nextId={Math.max(...users.map(u=>u.id),0)+1} onClose={()=>setShowUserModal(false)} onSave={u=>{setUsers(x=>[u,...x]);setShowUserModal(false);notify('کاربر جدید با موفقیت ثبت شد.')}}/>}
    <div className="toast-stack">{toasts.map(t=><div key={t.id} className={`toast ${t.tone}`}><span>{t.tone==='success'?<CheckCircle2 size={17}/>:t.tone==='danger'?<AlertTriangle size={17}/>:<Info size={17}/>}</span><b>{t.text}</b><button onClick={()=>setToasts(x=>x.filter(y=>y.id!==t.id))}><X size={14}/></button></div>)}</div>
  </div>
}

function NotificationPanel({items,onClear,onClose}:{items:NotificationItem[];onClear:()=>void;onClose:()=>void}){
  return <div className="notification-panel pop-in"><div className="notification-head"><div><b>اعلان‌ها</b><small>{items.length ? `${items.length} اعلان جدید`:'همه اعلان‌ها خوانده شده'}</small></div><div><button onClick={onClear}>خواندن همه</button><button className="plain-icon" onClick={onClose}><X size={16}/></button></div></div>{items.length?<div className="notification-list">{items.map(n=><div className="notification-item" key={n.id}><span className={`notification-dot ${n.tone}`}/><div><b>{n.title}</b><p>{n.text}</p><small>{n.time}</small></div></div>)}</div>:<div className="notification-empty"><CheckCircle2 size={30}/><b>اعلان جدیدی ندارید</b><span>سامانه در حال پایش موجودی است.</span></div>}</div>
}

function Dashboard({setPage,movements}:{setPage:(p:Page)=>void;movements:any[]}){
  const lineData=[38,42,35,58,52,69,63,78,74,88,84,94]
  const topParts=[
    ['بلبرینگ 6205','۲۴۸','84%','Boxes'],
    ['فیلتر روغن','۱۹۰','66%','PackageCheck'],
    ['سنسور القایی M18','۱۶۸','58%','Activity'],
    ['کابل ۳×۲۵','۱۴۵','50%','Zap'],
    ['پرس سوکت شبکه','۱۲۸','44%','Settings']
  ]
  const lowStock=seedParts.filter(p=>p.stock<=p.min).slice(0,5)
  return <>
    <section className="dash-welcome">
      <div className="dash-welcome-main">
        <div className="dash-date"><CalendarIcon/><div><b>سه‌شنبه ۱۵ مهر ۱۴۰۵</b><small>۷ اکتبر ۲۰۲۶</small></div><ChevronDown size={15}/></div>
        <div className="dash-welcome-copy"><span className="dash-kicker">NOVISOFT • PARTS MANAGEMENT</span><h2>به نووی‌سافت خوش آمدید 👋</h2><p>نمای کلی از وضعیت قطعات، انبار، تولید و فعالیت‌های سامانه</p></div>
      </div>
    </section>

    <div className="dash-kpis">
      <DashKpi icon={<PackageCheck/>} label="موجودی کل" value="۱۲,۴۵۰" growth="+۳٪" tone="pink" />
      <DashKpi icon={<ClipboardList/>} label="تعداد زیرگروه‌ها" value="۱۲۸" growth="+۸٪" tone="cyan" />
      <DashKpi icon={<Warehouse/>} label="تعداد گروه‌ها" value="۲۳" growth="+۵٪" tone="blue" />
      <DashKpi icon={<Boxes/>} label="کل قطعات" value="۲,۴۸۰" growth="+۱۲٪" tone="violet" />
    </div>

    <div className="dash-main-grid">
      <section className="dash-panel dash-line-panel">
        <div className="dash-panel-head"><div><h3>روند ورود و خروج قطعات</h3><small>مقایسه ورود و خروج در ۷ روز گذشته</small></div><button className="dash-select">۷ روز گذشته <ChevronDown size={13}/></button></div>
        <div className="dash-legend"><span><i className="legend-dot cyan"/> ورود</span><span><i className="legend-dot violet"/> خروج</span></div>
        <svg className="dash-line-chart" viewBox="0 0 620 245" preserveAspectRatio="none" aria-label="نمودار ورود و خروج">
          {[35,75,115,155,195].map((y,i)=><g key={i}><line x1="40" y1={y} x2="605" y2={y} className="chart-grid"/><text x="5" y={y+4} className="chart-label">{[2000,1500,1000,500,0][i].toLocaleString('fa-IR')}</text></g>)}
          {[60,125,190,255,320,385,450,515,580].map((x,i)=><line key={i} x1={x} y1="25" x2={x} y2="205" className="chart-grid vertical"/>)}
          <path d="M40 120 C75 112 92 125 125 128 S170 100 190 90 S230 72 255 75 S300 112 320 105 S355 92 385 86 S420 105 450 108 S490 72 515 65 S555 70 580 67 S595 66 605 65" className="chart-line cyan-line"/>
          <path d="M40 160 C75 157 95 165 125 158 S165 142 190 135 S230 143 255 147 S300 170 320 168 S355 142 385 135 S420 154 450 150 S490 126 515 130 S555 118 580 120 S595 119 605 119" className="chart-line violet-line"/>
          {[[40,120],[125,128],[190,90],[255,75],[320,105],[385,86],[450,108],[515,65],[580,67]].map(([x,y],i)=><circle key={'c'+i} cx={x} cy={y} r="4" className="chart-point cyan-point"/>)}
          {[[40,160],[125,158],[190,135],[255,147],[320,168],[385,135],[450,150],[515,130],[580,120]].map(([x,y],i)=><circle key={'v'+i} cx={x} cy={y} r="4" className="chart-point violet-point"/>)}
          {['۸ مهر','۹ مهر','۱۰ مهر','۱۱ مهر','۱۲ مهر','۱۳ مهر','۱۴ مهر','۱۵ مهر'].map((d,i)=><text key={d} x={60+i*74} y="225" className="chart-label">{d}</text>)}
        </svg>
      </section>

      <section className="dash-panel dash-donut-panel">
        <div className="dash-panel-head"><div><h3>توزیع قطعات بر اساس گروه</h3><small>سهم هر گروه از کل قطعات</small></div><button className="icon-soft"><FileBarChart size={15}/></button></div>
        <div className="donut-layout"><div className="donut"><div><strong>۲,۴۸۰</strong><span>قطعه</span></div></div><div className="donut-legend"><LegendRow color="cyan" label="قطعات مکانیکی" value="۸۴۰" percent="۳۴٪"/><LegendRow color="blue" label="قطعات الکتریکی" value="۶۲۰" percent="۲۵٪"/><LegendRow color="violet" label="ابزار و تجهیزات" value="۴۲۰" percent="۱۷٪"/><LegendRow color="purple" label="مصرفی و شیمیایی" value="۳۱۰" percent="۱۲٪"/><LegendRow color="pink" label="متفرقه" value="۲۹۰" percent="۱۲٪"/></div></div>
      </section>

      <section className="dash-panel dash-status-panel">
        <div className="dash-panel-head"><div><h3>وضعیت موجودی</h3><small>بر اساس حداقل موجودی</small></div><button className="icon-soft"><PackageCheck size={15}/></button></div>
        <div className="status-donut"><div><strong>۱۲,۴۵۰</strong><span>قلم موجود</span></div></div>
        <div className="status-list"><StatusRow color="cyan" label="بالاتر از حد مجاز" value="۹,۸۲۰" percent="۷۹٪"/><StatusRow color="violet" label="در آستانه (حداقل)" value="۱,۸۴۰" percent="۱۵٪"/><StatusRow color="pink" label="کمتر از حداقل" value="۷۹۰" percent="۶٪"/></div>
      </section>
    </div>

    <div className="dash-bottom-grid">
      <section className="dash-panel activity-panel"><div className="dash-panel-head"><div><h3>آخرین فعالیت‌ها</h3><small>رویدادهای اخیر سامانه</small></div><button onClick={()=>setPage('movements')}>مشاهده همه <ChevronLeft size={13}/></button></div><div className="activity-list">
        <ActivityRow icon={<PackageCheck/>} tone="cyan" time="۱۰:۴۲" title="ورود قطعه جدید" text="بلبرینگ 6205 به انبار اصلی اضافه شد"/>
        <ActivityRow icon={<ArrowUpFromLine/>} tone="pink" time="۰۹:۱۸" title="خروج قطعه از انبار" text="۲ عدد تسمه A-45 به خط تولید منتقل شد"/>
        <ActivityRow icon={<Pencil/>} tone="violet" time="۰۸:۵۶" title="ویرایش اطلاعات قطعه" text="مشخصات سنسور القایی M18 بروزرسانی شد"/>
        <ActivityRow icon={<UserPlus/>} tone="blue" time="۰۸:۱۲" title="افزودن کاربر جدید" text="کاربر انباردار با دسترسی محدود ایجاد شد"/>
        <ActivityRow icon={<PackageMinus/>} tone="orange" time="۰۷:۴۵" title="تغییر موجودی" text="موجودی کابل ۳×۲۵ اصلاح شد"/>
      </div></section>

      <section className="dash-panel low-panel"><div className="dash-panel-head"><div><h3>قطعات با موجودی کم</h3><small>نیازمند بررسی و تأمین</small></div><button onClick={()=>setPage('inventory')}>مشاهده همه <ChevronLeft size={13}/></button></div><div className="dash-table-wrap"><table className="dash-table"><thead><tr><th>کد قطعه</th><th>نام قطعه</th><th>موجودی</th><th>حداقل</th><th>وضعیت</th><th>مکان</th></tr></thead><tbody>{lowStock.map(p=><tr key={p.id}><td><code>{p.code}</code></td><td><b>{p.name}</b></td><td><strong>{p.stock}</strong></td><td>{p.min}</td><td><span className={`dash-status ${p.stock===0?'critical':'warning'}`}>{p.stock===0?'کمبود':'در آستانه'}</span></td><td>{p.location==='—'?'—':p.location.split('/').slice(0,2).join(' / ')}</td></tr>)}</tbody></table></div></section>

      <section className="dash-panel top-panel"><div className="dash-panel-head"><div><h3>پرفروش‌ترین / پرمصرف‌ترین قطعات</h3><small>بر اساس مصرف ماه جاری</small></div><button className="dash-select">ماه جاری <ChevronDown size={13}/></button></div><div className="top-parts">{topParts.map(([name,value,width,ic],i)=><div className="top-part" key={name}><div className={`top-part-icon tone-${i%5}`}>{i===0?<Boxes size={15}/>:i===1?<PackageCheck size={15}/>:i===2?<Activity size={15}/>:i===3?<Zap size={15}/>:<Settings size={15}/>}</div><div className="top-part-body"><div><b>{name}</b><strong>{value}</strong></div><div className="top-progress"><i style={{width}}/></div></div></div>)}</div></section>
    </div>
  </>
}
function CalendarIcon(){return <span className="calendar-icon"><span>مهر</span><b>۱۵</b></span>}
function DashKpi({icon,label,value,growth,tone}:{icon:React.ReactNode;label:string;value:string;growth:string;tone:string}){return <div className={`dash-kpi tone-${tone}`}><div className="dash-kpi-icon">{icon}</div><div className="dash-kpi-body"><span>{label}</span><strong>{value}</strong><small>{growth} <ArrowUpFromLine size={10}/></small></div><svg className="kpi-spark" viewBox="0 0 110 45" preserveAspectRatio="none"><path d="M2 38 C18 31 20 34 32 25 S50 30 60 19 S78 21 88 10 S99 14 108 4"/></svg></div>}
function LegendRow({color,label,value,percent}:{color:string;label:string;value:string;percent:string}){return <div className="legend-row"><span><i className={`legend-dot ${color}`}/>{label}</span><b>{value}</b><small>{percent}</small></div>}
function StatusRow({color,label,value,percent}:{color:string;label:string;value:string;percent:string}){return <div className="status-row"><span><i className={`legend-dot ${color}`}/>{label}</span><b>{value}</b><small>{percent}</small></div>}
function ActivityRow({icon,tone,time,title,text}:{icon:React.ReactNode;tone:string;time:string;title:string;text:string}){return <div className="activity-row"><span className={`activity-icon ${tone}`}>{icon}</span><div><b>{title}</b><small>{text}</small></div><time>{time}</time></div>}

function Kpi({icon,label,value,sub,danger=false}:{icon:React.ReactNode;label:string;value:number|string;sub:string;danger?:boolean}){return <div className="kpi card-hover"><div className={`kpi-icon ${danger?'danger':''}`}>{icon}</div><div><span>{label}</span><strong>{value}</strong><small className={danger?'danger-text':''}>{sub}</small></div><span className="kpi-shine"/></div>}

function Parts({parts,groups,subgroups,query,onAdd,onDelete,onEdit,canCatalog,onAddGroup,onUpdateGroup,onDeleteGroup,onAddSubgroup,onUpdateSubgroup,onDeleteSubgroup}:{parts:Part[];groups:PartGroup[];subgroups:Subgroup[];query:string;onAdd:()=>void;onDelete:(id:string)=>void;onEdit:(p:Part)=>void;canCatalog:boolean;onAddGroup:(g:PartGroup)=>void;onUpdateGroup:(g:PartGroup)=>void;onDeleteGroup:(id:number)=>void;onAddSubgroup:(s:Subgroup)=>void;onUpdateSubgroup:(s:Subgroup)=>void;onDeleteSubgroup:(id:number)=>void}){
  const [tab,setTab]=useState<'parts'|'groups'|'subgroups'>('parts')
  const [status,setStatus]=useState('همه')
  const [categoryModal,setCategoryModal]=useState<{kind:'group'|'subgroup';item?:PartGroup|Subgroup}|null>(null)
  const filtered = useMemo(()=>parts.filter(p=>(p.name+p.code+p.group+p.subgroup+p.location).includes(query)).filter(p=>status==='همه'||p.status===status),[parts,query,status])
  const groupCount=(id:number)=>subgroups.filter(s=>s.groupId===id).length
  return <>
    <PageHead title="کاتالوگ قطعات" desc="مدیریت گروه، زیرگروه و کدگذاری یکتای قطعات" action="ثبت قطعه جدید" onAction={onAdd}/>
    <div className="segmented"><button className={tab==='parts'?'active':''} onClick={()=>setTab('parts')}><Boxes size={15}/> قطعات <b>{parts.length}</b></button><button className={tab==='groups'?'active':''} onClick={()=>setTab('groups')}><ClipboardList size={15}/> گروه‌ها <b>{groups.length}</b></button><button className={tab==='subgroups'?'active':''} onClick={()=>setTab('subgroups')}><SlidersHorizontal size={15}/> زیرگروه‌ها <b>{subgroups.length}</b></button></div>
    {tab==='parts' && <section className="card"><div className="toolbar"><div className="filter-tabs">{['همه','موجود','کمبود','ناموجود'].map(x=><button key={x} className={status===x?'active':''} onClick={()=>setStatus(x)}>{x}</button>)}</div><span className="result-count">{filtered.length} نتیجه</span></div><div className="table-wrap"><table className="wide-table"><thead><tr><th>شناسه</th><th>کد قطعه</th><th>نام قطعه</th><th>گروه / زیرگروه</th><th>موجودی</th><th>مکان</th><th>وضعیت</th><th>عملیات</th></tr></thead><tbody>{filtered.map(p=><tr key={p.id} className="table-row-animated"><td><code>{p.id}</code></td><td><span className="code-badge">{p.code}</span></td><td><b>{p.name}</b><small className="muted">واحد: {p.unit}</small></td><td><b>{p.group}</b><small className="muted">{p.subgroup}</small></td><td><strong>{p.stock}</strong><small className="muted">حداقل {p.min}</small></td><td><span className="location"> <MapPin size={13}/>{p.location}</span></td><td><span className={`status ${p.status==='موجود'?'ok':p.status==='کمبود'?'warn':'bad'}`}>{p.status}</span></td><td><div className="row-actions"><button title="مشاهده"><Eye size={14}/></button><button title="ویرایش" onClick={()=>onEdit(p)}><Edit3 size={14}/></button><button title="حذف" onClick={()=>onDelete(p.id)}><Trash2 size={14}/></button></div></td></tr>)}</tbody></table></div></section>}
    {tab==='groups' && <section><div className="category-toolbar"><div><b>گروه‌های قطعات</b><small>گروه‌ها را مستقیماً از همین صفحه مدیریت کنید.</small></div>{canCatalog&&<button className="primary primary-dark" onClick={()=>setCategoryModal({kind:'group'})}><Plus size={15}/> گروه جدید</button>}</div><div className="entity-grid">{groups.map(g=><div className="entity-card card-hover" key={g.id}><div className="entity-icon"><Boxes size={19}/></div><span className="entity-code">گروه {g.code}</span><h3>{g.name}</h3><p>{g.description||'گروه قطعات سازمانی'}</p><div className="entity-footer"><b>{groupCount(g.id)} زیرگروه</b>{canCatalog&&<div className="row-actions"><button title="ویرایش" onClick={()=>setCategoryModal({kind:'group',item:g})}><Pencil size={13}/></button><button title="حذف" onClick={()=>onDeleteGroup(g.id)}><Trash2 size={13}/></button></div>}</div></div>)}</div></section>}
    {tab==='subgroups' && <section><div className="category-toolbar"><div><b>زیرگروه‌های قطعات</b><small>هر زیرگروه به یک گروه اصلی متصل است.</small></div>{canCatalog&&<button className="primary primary-dark" onClick={()=>setCategoryModal({kind:'subgroup'})}><Plus size={15}/> زیرگروه جدید</button>}</div><div className="entity-grid">{subgroups.map(s=>{const g=groups.find(x=>x.id===s.groupId);return <div className="entity-card card-hover" key={s.id}><div className="entity-icon"><SlidersHorizontal size={19}/></div><span className="entity-code">{g?.code}.{s.code}</span><h3>{s.name}</h3><p>{s.description||'زیرگروه قطعات'}</p><div className="entity-footer"><b>{g?.name||'بدون گروه'}</b>{canCatalog&&<div className="row-actions"><button title="ویرایش" onClick={()=>setCategoryModal({kind:'subgroup',item:s})}><Pencil size={13}/></button><button title="حذف" onClick={()=>onDeleteSubgroup(s.id)}><Trash2 size={13}/></button></div>}</div></div>})}</div></section>}
    {categoryModal&&<CategoryModal kind={categoryModal.kind} item={categoryModal.item} groups={groups} subgroups={subgroups} onClose={()=>setCategoryModal(null)} onSave={(item:any)=>{categoryModal.kind==='group'?(item.id?onUpdateGroup(item):onAddGroup(item)):(item.id?onUpdateSubgroup(item):onAddSubgroup(item));setCategoryModal(null)}}/>}
  </>
}

function PageHead({title,desc,action,onAction}:{title:string;desc:string;action?:string;onAction?:()=>void}){return <div className="page-head"><div><div className="section-kicker">NOVISOFT / MANAGEMENT</div><h2>{title}</h2><p>{desc}</p></div>{action&&<button className="primary primary-dark" onClick={onAction}><Plus size={16}/>{action}</button>}</div>}
function GroupGrid({groups}:{groups:PartGroup[]}){return <div className="entity-grid">{groups.map((g,i)=><div className="entity-card card-hover" key={g.id}><div className="entity-icon"><Boxes size={19}/></div><span className="entity-code">گروه {g.code}</span><h3>{g.name}</h3><p>{g.description}</p><div className="entity-footer"><b>{i+2} زیرگروه</b><button><MoreHorizontal size={15}/></button></div></div>)}</div>}
function SubgroupGrid({groups,subgroups}:{groups:PartGroup[];subgroups:Subgroup[]}){return <div className="entity-grid">{subgroups.map(s=>{const g=groups.find(x=>x.id===s.groupId);return <div className="entity-card card-hover" key={s.id}><div className="entity-icon"><SlidersHorizontal size={19}/></div><span className="entity-code">{g?.code}.{s.code}</span><h3>{s.name}</h3><p>{s.description}</p><div className="entity-footer"><b>{g?.name}</b><button><MoreHorizontal size={15}/></button></div></div>})}</div>}

function PartModal({groups,subgroups,parts,onClose,onSave}:{groups:PartGroup[];subgroups:Subgroup[];parts:Part[];onClose:()=>void;onSave:(p:Part)=>void}){
  const [groupId,setGroupId]=useState(groups[0]?.id??1)
  const available=subgroups.filter(s=>s.groupId===groupId)
  const [subgroupId,setSubgroupId]=useState(available[0]?.id??0)
  const [name,setName]=useState('')
  const [unit,setUnit]=useState('عدد')
  const [min,setMin]=useState('10')
  const [location,setLocation]=useState('انبار قطعات / A01 / طبقه 1')
  React.useEffect(()=>{setSubgroupId(subgroups.find(s=>s.groupId===groupId)?.id??0)},[groupId,subgroups])
  const subgroup=subgroups.find(s=>s.id===subgroupId); const group=groups.find(g=>g.id===groupId)
  const next=parts.filter(p=>p.subgroupId===subgroupId).reduce((m,p)=>Math.max(m,Number(p.code.split('.').at(-1))||0),0)+1
  const code=`${group?.code??'00'}.${subgroup?.code??'00'}.${String(next).padStart(4,'0')}`
  const save=(e:React.FormEvent)=>{e.preventDefault();if(!name.trim())return;onSave({id:`PF-${String(parts.length+1).padStart(8,'0')}`,code,name:name.trim(),groupId,subgroupId,group:group?.name??'',subgroup:subgroup?.name??'',unit,stock:0,min:Number(min)||0,location,status:'ناموجود'})}
  return <div className="modal-backdrop"><div className="modal pop-in"><div className="modal-head"><div><span className="section-kicker">NEW PART</span><h2>ثبت قطعه جدید</h2><p>کد قطعه به صورت خودکار تولید می‌شود.</p></div><button className="icon-btn" onClick={onClose}><X size={18}/></button></div><form onSubmit={save}><div className="form-grid"><div className="form-field"><label>گروه</label><select value={groupId} onChange={e=>setGroupId(Number(e.target.value))}>{groups.map(g=><option key={g.id} value={g.id}>{g.code} — {g.name}</option>)}</select></div><div className="form-field"><label>زیرگروه</label><select value={subgroupId} onChange={e=>setSubgroupId(Number(e.target.value))}>{available.map(s=><option key={s.id} value={s.id}>{s.code} — {s.name}</option>)}</select></div><div className="form-field full"><label>نام قطعه</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="مثلاً بلبرینگ 6206" autoFocus/></div><div className="form-field"><label>واحد</label><select value={unit} onChange={e=>setUnit(e.target.value)}><option>عدد</option><option>متر</option><option>کیلوگرم</option><option>لیتر</option></select></div><div className="form-field"><label>حداقل موجودی</label><input value={min} onChange={e=>setMin(e.target.value)} type="number" min="0"/></div><div className="form-field full"><label>مکان اولیه</label><input value={location} onChange={e=>setLocation(e.target.value)} placeholder="انبار / راهرو / قفسه / طبقه"/></div></div><div className="generated-code"><div><span>کد خودکار قطعه</span><strong>{code}</strong></div><div><span>شناسه سیستمی</span><strong>PF-{String(parts.length+1).padStart(8,'0')}</strong></div><CheckCircle2 size={23}/></div><div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>انصراف</button><button type="submit" className="primary primary-dark"><Plus size={16}/> ثبت قطعه</button></div></form></div></div>
}

function Inventory({parts}:{parts:Part[]}){return <><PageHead title="انبار و مکان" desc="موجودی لحظه‌ای و موقعیت دقیق هر قطعه"/><div className="transaction-kpis"><Mini icon={<Warehouse/>} label="انبارها" value="۳"/><Mini icon={<MapPin/>} label="مکان‌های فعال" value="۴۸"/><Mini icon={<Boxes/>} label="واحد موجودی" value={parts.reduce((s,p)=>s+p.stock,0)}/><Mini icon={<AlertTriangle/>} label="نیازمند تأمین" value={parts.filter(p=>p.stock<=p.min).length}/></div><div className="location-grid"><LocationCard icon={<Warehouse/>} title="انبار قطعات مرکزی" count="۲۴۸" sub="قلم موجودی"/><LocationCard icon={<Factory/>} title="انبار تعمیرات" count="۷۶" sub="قلم موجودی"/><LocationCard icon={<Zap/>} title="انبار برق" count="۵۴" sub="قلم موجودی"/><LocationCard icon={<MapPin/>} title="مکان‌های تولید" count="۳۱" sub="مکان فعال"/></div><section className="card inventory-summary"><div className="card-head"><div><h3>موجودی قطعات</h3><small>نمایش مکان فعلی و سطح موجودی</small></div><button><RefreshCw size={14}/> بروزرسانی</button></div><div className="table-wrap"><table><thead><tr><th>قطعه</th><th>کد</th><th>موجودی</th><th>حد سفارش</th><th>مکان</th><th>وضعیت</th></tr></thead><tbody>{parts.map(p=><tr key={p.id}><td><b>{p.name}</b></td><td><code>{p.code}</code></td><td><strong>{p.stock}</strong></td><td>{p.min}</td><td><span className="location"><MapPin size={13}/>{p.location}</span></td><td><span className={`status ${p.stock===0?'bad':p.stock<=p.min?'warn':'ok'}`}>{p.stock===0?'ناموجود':p.stock<=p.min?'کمبود':'موجود'}</span></td></tr>)}</tbody></table></div></section></>}
function LocationCard({icon,title,count,sub}:{icon:React.ReactNode;title:string;count:string;sub:string}){return <div className="location-card card-hover"><div className="loc-top"><div className="loc-icon">{icon}</div><button className="more"><MoreHorizontal size={16}/></button></div><h3>{title}</h3><span>ساختار: سالن / راهرو / قفسه / طبقه</span><strong>{count}<small> {sub}</small></strong><div className="loc-footer"><span><CheckCircle2 size={13}/> فعال</span><button>مشاهده <ChevronLeft size={12}/></button></div></div>}

function Movements({movements}:{movements:any[]}){return <><PageHead title="گردش قطعات" desc="تمام ورود، خروج، انتقال و مصرف قطعات" action="ثبت گردش" onAction={()=>alert('در نسخه API این عملیات متصل می‌شود.')}/><div className="transaction-kpis"><Mini icon={<ArrowDownToLine/>} label="ورودی امروز" value="۳۲"/><Mini icon={<ArrowUpFromLine/>} label="خروجی امروز" value="۸"/><Mini icon={<ArrowLeftRight/>} label="انتقال" value="۱۴"/><Mini icon={<Factory/>} label="مصرف تولید" value="۵"/></div><section className="card"><div className="card-head"><div><h3>تاریخچه عملیات</h3><small>ثبت‌شده با کاربر، زمان و مقصد</small></div><div className="filter-tabs"><button className="active">همه</button><button>ورود</button><button>خروج</button><button>انتقال</button></div></div><div className="table-wrap"><table><thead><tr><th>قطعه</th><th>نوع عملیات</th><th>تعداد</th><th>مبدأ</th><th>مقصد</th><th>کاربر</th><th>تاریخ</th></tr></thead><tbody>{movements.map((m:any)=><tr key={m.id}><td><b>{m.part}</b></td><td><span className={`tag ${m.type==='ورود'?'green':m.type==='خروج'?'orange':'blue'}`}>{m.type}</span></td><td><strong>{m.qty}</strong></td><td>{m.from}</td><td>{m.to}</td><td>{m.user}</td><td className="muted">{m.date}</td></tr>)}</tbody></table></div></section></>}
function Mini({icon,label,value}:{icon:React.ReactNode;label:string;value:string|number}){return <div className="mini card-hover"><div><span>{label}</span><b>{value}</b></div><span className="mini-icon">{icon}</span></div>}
function Production(){return <><PageHead title="تولید و مصرف" desc="خطوط تولید، ماشین‌آلات و مصرف قطعات"/><div className="production-grid"><Prod title="خط تولید ۱" machine="دستگاه بسته‌بندی" value="۹۲٪"/><Prod title="خط تولید ۲" machine="دستگاه پرکن" value="۸۶٪"/><Prod title="خط تولید ۳" machine="دستگاه لیبل‌زن" value="۷۸٪"/></div><section className="card"><div className="card-head"><div><h3>آخرین مصرف قطعات در تولید</h3><small>اتصال مصرف به خط و ماشین</small></div><button><FileText size={14}/> گزارش مصرف</button></div><div className="table-wrap"><table><thead><tr><th>قطعه</th><th>خط تولید</th><th>ماشین</th><th>مصرف</th><th>ثبت‌کننده</th><th>زمان</th></tr></thead><tbody>{seedMovements.filter(x=>x.type.includes('تولید')||x.type.includes('مصرف')).map((m:any)=><tr key={m.id}><td><b>{m.part}</b></td><td>{m.to==='—'?'خط تولید ۳':m.to}</td><td>دستگاه ۴</td><td><strong>{m.qty}</strong></td><td>{m.user}</td><td>{m.date}</td></tr>)}</tbody></table></div></section></>}
function Prod({title,machine,value}:{title:string;machine:string;value:string}){return <div className="prod-card card-hover"><div className="prod-icon"><Factory size={20}/></div><h3>{title}</h3><span>{machine}</span><div><b>{value}</b><span> راندمان</span></div><div className="prod-progress"><i style={{width:value}}/></div><button>مشاهده جزئیات <ChevronLeft size={12}/></button></div>}
function Reports({notify}:{notify:(x:string,t?:Toast['tone'])=>void}){const reports=[['گزارش موجودی','وضعیت موجودی و اقلام بحرانی',Warehouse],['گردش قطعات','ورود، خروج، انتقال و مصرف',ArrowLeftRight],['مصرف تولید','مصرف بر اساس خط و ماشین',Factory],['گزارش کدینگ','گروه، زیرگروه و ساختار کدها',Boxes],['گزارش عملکرد','شاخص‌های عملیاتی سامانه',BarChart3],['گزارش ممیزی','تاریخچه تغییرات و کاربران',ShieldCheck]] as const;return <><PageHead title="گزارش‌ها" desc="گزارش‌های عملیاتی و مدیریتی سامانه"/><div className="report-grid">{reports.map(([t,d,I])=><div className="report-card card-hover" key={t}><div className="report-icon"><I size={19}/></div><span>گزارش مدیریتی</span><h3>{t}</h3><p>{d}</p><button onClick={()=>notify(`گزارش «${t}» برای اتصال به Power BI آماده است.`,'info')}>مشاهده گزارش <ChevronLeft size={13}/></button></div>)}</div></>}
function UsersPage({users,onAdd,onToggle,notify}:{users:AppUser[];onAdd:()=>void;onToggle:(id:number)=>void;notify:(x:string,t?:Toast['tone'])=>void}){return <><PageHead title="کاربران و دسترسی" desc="مدیریت کاربران، نقش‌ها و سطح دسترسی" action="کاربر جدید" onAction={onAdd}/><div className="access-grid"><Access icon={<ShieldCheck/>} title="Administrator" text="دسترسی کامل سامانه" count={`${users.filter(u=>u.role==='Administrator').length} کاربر`}/><Access icon={<Warehouse/>} title="انباردار" text="ورود، خروج و موجودی" count="۵ کاربر"/><Access icon={<Factory/>} title="تولید" text="درخواست و مصرف قطعات" count="۸ کاربر"/><Access icon={<BarChart3/>} title="مدیریت" text="گزارش و داشبورد" count="۴ کاربر"/></div><section className="card"><div className="card-head"><div><h3>کاربران سامانه</h3><small>مدیریت محلی فعلاً فعال است؛ در Backend به AD / LDAP متصل می‌شود.</small></div><button onClick={()=>notify('لیست کاربران بروزرسانی شد.','success')}><RefreshCw size={14}/> بروزرسانی</button></div><div className="table-wrap"><table className="wide-table"><thead><tr><th>کاربر</th><th>نام نمایشی</th><th>نقش</th><th>وضعیت</th><th>آخرین ورود</th><th>عملیات</th></tr></thead><tbody>{users.map(u=><tr key={u.id}><td><code>{u.username}</code></td><td><b>{u.name}</b></td><td>{u.role}</td><td><button className={`status ${u.status==='فعال'?'ok':'bad'} status-button`} onClick={()=>onToggle(u.id)}>{u.status}</button></td><td className="muted">{u.lastLogin}</td><td><button className="row-action-text" onClick={()=>notify(`ویرایش کاربر ${u.username} آماده اتصال به API است.`,'info')}><Pencil size={13}/> ویرایش</button></td></tr>)}</tbody></table></div></section></>}
function Access({icon,title,text,count}:{icon:React.ReactNode;title:string;text:string;count:string}){return <div className="access-card card-hover"><div className="access-icon">{icon}</div><h3>{title}</h3><p>{text}</p><div className="access-footer"><b>{count}</b><button><SlidersHorizontal size={14}/></button></div></div>}
function SettingsPage({darkMode,setDarkMode,permissions,setPermissions,notify}:{darkMode:boolean;setDarkMode:(v:boolean)=>void;permissions:Record<PermissionKey,boolean>;setPermissions:React.Dispatch<React.SetStateAction<Record<PermissionKey,boolean>>>;notify:(x:string,t?:Toast['tone'])=>void}){const roles=['Administrator','انباردار','تولید','مدیریت'];return <><PageHead title="تنظیمات" desc="تنظیمات ظاهری، دسترسی و زیرساختی Novisoft Parts Management"/><div className="settings-grid"><div className="setting card-hover theme-setting"><div className="setting-icon">{darkMode?<Moon/>:<Sun/>}</div><h3>حالت نمایش</h3><p>{darkMode?'تم تاریک فعال است.':'تم روشن فعال است.'}</p><button onClick={()=>{setDarkMode(!darkMode);notify(darkMode?'حالت روشن فعال شد.':'حالت تاریک فعال شد.','info')}}><span>{darkMode?'بازگشت به روشن':'فعال‌سازی دارک مود'}</span>{darkMode?<Sun size={13}/>:<Moon size={13}/>}</button></div><Setting icon={<Database/>} title="اتصال پایگاه داده" text="SQL Server / PartsFlowDB" action="متصل"/><Setting icon={<ShieldCheck/>} title="احراز هویت" text="Active Directory + JWT" action="آماده"/><Setting icon={<BarChart3/>} title="گزارش‌گیری" text="Power BI Report Server" action="آماده"/></div><section className="card permissions-card"><div className="card-head"><div><h3>مدیریت دسترسی‌ها</h3><small>این دسترسی‌ها در نسخه فعلی Frontend داینامیک هستند و در Backend به Role/Permission تبدیل می‌شوند.</small></div><button className="primary primary-dark" onClick={()=>notify('تنظیمات دسترسی ذخیره شد.','success')}><Save size={14}/> ذخیره تغییرات</button></div><div className="permission-grid"><div className="permission-head"><span>مجوز</span>{roles.map(r=><b key={r}>{r}</b>)}</div>{(Object.keys(permissionLabels) as PermissionKey[]).map(key=><div className="permission-row" key={key}><span><Shield size={14}/>{permissionLabels[key]}</span>{roles.map((role,i)=>{const checked=i===0?permissions[key]:(key==='viewReports'&&role==='مدیریت')||(key==='manageInventory'&&role==='انباردار')||(key==='manageParts'&&role==='تولید');return <button key={role} className={`permission-toggle ${checked?'on':''}`} onClick={()=>i===0&&setPermissions(p=>({...p,[key]:!p[key]}))} title={i===0?'تغییر دسترسی Administrator':'دسترسی نمونه'}><span>{checked?'✓':'—'}</span></button>})}</div>)}</div></section><section className="settings-panel"><div><span className="section-kicker">SYSTEM HEALTH</span><h3>وضعیت سرویس‌ها</h3><p>اجزای اصلی برای اتصال Backend آماده هستند.</p></div><div className="health-list"><Health title="Frontend"/><Health title="API Contract"/><Health title="SQL Server"/><Health title="Power BI"/></div><button className="secondary" onClick={()=>notify('بررسی سلامت سامانه با موفقیت انجام شد.','success')}><RefreshCw size={15}/> بررسی مجدد</button></section></>}
function Setting({icon,title,text,action}:{icon:React.ReactNode;title:string;text:string;action:string}){return <div className="setting card-hover"><div className="setting-icon">{icon}</div><h3>{title}</h3><p>{text}</p><button><span>{action}</span><ChevronLeft size={13}/></button></div>}
function Health({title}:{title:string}){return <div className="health"><span className="health-dot"/><b>{title}</b><small>Ready</small></div>}
function CategoryModal({kind,item,groups,subgroups,onClose,onSave}:{kind:'group'|'subgroup';item?:PartGroup|Subgroup;groups:PartGroup[];subgroups:Subgroup[];onClose:()=>void;onSave:(item:any)=>void}){
  const isGroup=kind==='group'; const existing=item as any; const [name,setName]=useState(existing?.name||''); const [code,setCode]=useState(existing?.code||''); const [groupId,setGroupId]=useState(existing?.groupId||groups[0]?.id||1); const [desc,setDesc]=useState(existing?.description||'')
  const nextCode=String((isGroup?groups:subgroups.filter(s=>s.groupId===groupId)).reduce((m:any,x:any)=>Math.max(m,Number(x.code)||0),0)+1).padStart(2,'0')
  useEffect(()=>{if(!existing?.id)setCode(nextCode)},[nextCode,existing?.id])
  const submit=(e:React.FormEvent)=>{e.preventDefault();if(!name.trim())return;if(isGroup)onSave({id:existing?.id,code:code||nextCode,name:name.trim(),description:desc});else onSave({id:existing?.id,groupId,code:code||nextCode,name:name.trim(),description:desc})}
  return <div className="modal-backdrop"><div className="modal pop-in"><div className="modal-head"><div><span className="section-kicker">DYNAMIC CATALOG</span><h2>{existing?'ویرایش':'افزودن'} {isGroup?'گروه':'زیرگروه'}</h2><p>تغییرات بلافاصله در کاتالوگ قطعات اعمال می‌شود.</p></div><button className="icon-btn" onClick={onClose}><X size={18}/></button></div><form onSubmit={submit}><div className="form-grid"><div className="form-field"><label>کد {isGroup?'گروه':'زیرگروه'}</label><input value={code} onChange={e=>setCode(e.target.value)} disabled={!!existing}/></div>{!isGroup&&<div className="form-field"><label>گروه اصلی</label><select value={groupId} onChange={e=>setGroupId(Number(e.target.value))}>{groups.map(g=><option key={g.id} value={g.id}>{g.code} — {g.name}</option>)}</select></div>}<div className="form-field full"><label>نام</label><input value={name} onChange={e=>setName(e.target.value)} autoFocus placeholder={isGroup?'مثلاً برق و الکترونیک':'مثلاً بلبرینگ'}/></div><div className="form-field full"><label>توضیحات</label><input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="توضیح کوتاه"/></div></div><div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>انصراف</button><button type="submit" className="primary primary-dark"><Save size={16}/> ذخیره</button></div></form></div></div>
}
function UserModal({nextId,onClose,onSave}:{nextId:number;onClose:()=>void;onSave:(u:AppUser)=>void}){const [username,setUsername]=useState('');const [name,setName]=useState('');const [role,setRole]=useState('انباردار');const [password,setPassword]=useState('');const submit=(e:React.FormEvent)=>{e.preventDefault();if(!username.trim()||!name.trim()||!password)return;onSave({id:nextId,username:username.trim(),name:name.trim(),role,status:'فعال',lastLogin:'هنوز وارد نشده'})};return <div className="modal-backdrop"><div className="modal pop-in"><div className="modal-head"><div><span className="section-kicker">USER MANAGEMENT</span><h2>افزودن کاربر</h2><p>کاربر فعلاً به صورت محلی ثبت می‌شود و بعداً به AD/LDAP متصل خواهد شد.</p></div><button className="icon-btn" onClick={onClose}><X size={18}/></button></div><form onSubmit={submit}><div className="form-grid"><div className="form-field"><label>نام کاربری</label><input value={username} onChange={e=>setUsername(e.target.value)} autoFocus/></div><div className="form-field"><label>نام نمایشی</label><input value={name} onChange={e=>setName(e.target.value)}/></div><div className="form-field"><label>نقش</label><select value={role} onChange={e=>setRole(e.target.value)}><option>Administrator</option><option>انباردار</option><option>تولید</option><option>مدیریت</option></select></div><div className="form-field"><label>رمز عبور اولیه</label><input value={password} onChange={e=>setPassword(e.target.value)} type="password"/></div></div><div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>انصراف</button><button type="submit" className="primary primary-dark"><UserPlus size={16}/> ثبت کاربر</button></div></form></div></div>}

createRoot(document.getElementById('root')!).render(<App />)
