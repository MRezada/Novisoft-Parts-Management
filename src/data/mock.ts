import type { Part, PartGroup, Subgroup } from '../types'

export const groups: PartGroup[] = [
  { id: 1, code: '11', name: 'مکانیکی', description: 'قطعات مکانیکی ماشین‌آلات' },
  { id: 2, code: '12', name: 'برق', description: 'قطعات و تجهیزات برقی' },
  { id: 3, code: '13', name: 'انتقال قدرت', description: 'تسمه، زنجیر و تجهیزات انتقال قدرت' },
  { id: 4, code: '14', name: 'مصرفی', description: 'قطعات و اقلام مصرفی' },
]

export const subgroups: Subgroup[] = [
  { id: 101, groupId: 1, code: '01', name: 'بلبرینگ', description: 'انواع بلبرینگ و رولبرینگ' },
  { id: 102, groupId: 1, code: '02', name: 'آب‌بندی', description: 'کاسه‌نمد و اورینگ' },
  { id: 103, groupId: 2, code: '01', name: 'سنسور', description: 'سنسورها و تجهیزات اندازه‌گیری' },
  { id: 104, groupId: 2, code: '02', name: 'حفاظت', description: 'فیوز، کنتاکتور و حفاظت' },
  { id: 105, groupId: 3, code: '01', name: 'تسمه', description: 'تسمه‌های انتقال قدرت' },
  { id: 106, groupId: 4, code: '01', name: 'فیلتر', description: 'فیلترهای مصرفی' },
]

export const parts: Part[] = [
 {id:'PF-00000001',code:'11.01.0001',name:'بلبرینگ 6205',groupId:1,subgroupId:101,group:'مکانیکی',subgroup:'بلبرینگ',unit:'عدد',stock:42,min:10,location:'انبار قطعات / A01 / طبقه 2',status:'موجود'},
 {id:'PF-00000002',code:'13.01.0001',name:'تسمه A-45',groupId:3,subgroupId:105,group:'انتقال قدرت',subgroup:'تسمه',unit:'عدد',stock:8,min:10,location:'انبار قطعات / B12 / طبقه 1',status:'کمبود'},
 {id:'PF-00000003',code:'11.02.0001',name:'کاسه نمد 35×52',groupId:1,subgroupId:102,group:'مکانیکی',subgroup:'آب‌بندی',unit:'عدد',stock:0,min:5,location:'—',status:'ناموجود'},
 {id:'PF-00000004',code:'12.01.0001',name:'سنسور القایی M18',groupId:2,subgroupId:103,group:'برق',subgroup:'سنسور',unit:'عدد',stock:16,min:5,location:'انبار برق / C02 / طبقه 3',status:'موجود'},
 {id:'PF-00000005',code:'14.01.0001',name:'فیلتر روغن',groupId:4,subgroupId:106,group:'مصرفی',subgroup:'فیلتر',unit:'عدد',stock:24,min:8,location:'انبار تعمیرات / R01 / طبقه 1',status:'موجود'},
 {id:'PF-00000006',code:'12.02.0001',name:'فیوز 10 آمپر',groupId:2,subgroupId:104,group:'برق',subgroup:'حفاظت',unit:'عدد',stock:6,min:10,location:'انبار برق / C01 / طبقه 2',status:'کمبود'},
 {id:'PF-00000007',code:'12.02.0002',name:'کنتاکتور 32A',groupId:2,subgroupId:104,group:'برق',subgroup:'حفاظت',unit:'عدد',stock:18,min:6,location:'انبار برق / C03 / طبقه 1',status:'موجود'},
 {id:'PF-00000008',code:'11.02.0002',name:'واشر تخت M10',groupId:1,subgroupId:102,group:'مکانیکی',subgroup:'آب‌بندی',unit:'عدد',stock:0,min:20,location:'—',status:'ناموجود'},
]

export const movements = [
 {id:1,part:'بلبرینگ 6205',type:'انتقال به تولید',qty:5,from:'A01 / طبقه 2',to:'خط تولید 2 / دستگاه 4',user:'علی رضایی',date:'1406/07/07 - 09:42'},
 {id:2,part:'تسمه A-45',type:'خروج',qty:2,from:'B12 / طبقه 1',to:'خط تولید 1',user:'محمد احمدی',date:'1406/07/07 - 09:18'},
 {id:3,part:'فیلتر روغن',type:'ورود',qty:20,from:'تأمین‌کننده',to:'R01 / طبقه 1',user:'سارا کریمی',date:'1406/07/06 - 15:30'},
 {id:4,part:'سنسور القایی M18',type:'مصرف تولید',qty:1,from:'خط تولید 3',to:'—',user:'رضا موسوی',date:'1406/07/06 - 11:12'},
 {id:5,part:'کنتاکتور 32A',type:'ورود',qty:12,from:'تأمین‌کننده',to:'C03 / طبقه 1',user:'علی رضایی',date:'1406/07/05 - 14:10'},
]
