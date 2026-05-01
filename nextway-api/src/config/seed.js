require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const connectDB = require('./db');

const School       = require('../models/School');
const User         = require('../models/User');
const AcademicYear = require('../models/AcademicYear');
const { Class, Section, Subject } = require('../models/Academic');
const Student      = require('../models/Student');
const Attendance   = require('../models/Attendance');
const { FeeStructure, FeeInvoice, FeePayment } = require('../models/Fee');
const { Homework, Exam, ExamResult } = require('../models/Academic2');
const { Leave, TransportRoute, HostelRoom, Book, BookIssue, Inventory, Notice, AuditLog } = require('../models/Misc');

const rand  = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const pick  = arr  => arr[rand(0,arr.length-1)];
const pad   = (n,d=4) => String(n).padStart(d,'0');
const dAgo  = days => { const d=new Date(); d.setDate(d.getDate()-days); return d; };

const FN_M=['Aarav','Rohan','Arjun','Karan','Vivaan','Dev','Nikhil','Pranav','Aditya','Siddharth','Rahul','Ishaan','Kabir','Vihaan','Arnav','Yash','Rishi','Ansh','Kunal','Mohit','Raj','Harsh','Ayush','Shivam','Gaurav'];
const FN_F=['Priya','Sneha','Riya','Ananya','Pooja','Neha','Divya','Kavya','Aisha','Simran','Nisha','Shreya','Tanvi','Meera','Sakshi','Komal','Swati','Anjali','Ritika','Deepika','Trisha','Isha','Nidhi','Pallavi','Sonal'];
const LN  =['Sharma','Gupta','Singh','Patel','Kumar','Verma','Joshi','Mishra','Tiwari','Agarwal','Yadav','Srivastava','Chauhan','Pandey','Mehta','Shah','Desai','Nair','Reddy','Iyer'];
const BG  =['A+','A-','B+','B-','AB+','AB-','O+','O-'];
const CITIES=['Indore','Bhopal','Jabalpur','Ujjain','Gwalior'];

const rName=g=>({ firstName:pick(g==='Male'?FN_M:FN_F), lastName:pick(LN) });
const rPhone=()=>`9${rand(600000000,999999999)}`;
const rDOB=n=>new Date(2024-n-5, rand(0,11), rand(1,28));

async function seed(){
  await connectDB();
  console.log('\n Seeding NEXTWAY...\n');

  // Clear
  await Promise.all([Student,Attendance,FeeInvoice,FeePayment,FeeStructure,Homework,Exam,ExamResult,Leave,Book,BookIssue,Inventory,Notice,AuditLog,TransportRoute,HostelRoom,Class,Section,Subject,AcademicYear,School].map(M=>M.deleteMany({})));
  await User.deleteMany({ role:{ $ne:'super_admin' } });
  console.log('Cleared old data');

  // School
  const school = await School.create({ name:'NEXTWAY Academy', code:'NWA001', board:'CBSE', type:'Co-educational', address:{ street:'42 Vijay Nagar', city:'Indore', state:'Madhya Pradesh', pincode:'452010' }, phone:'+917314000000', email:'info@nextway.edu.in', established:2005 });

  // AY
  const ay = await AcademicYear.create({ schoolId:school._id, name:'2025-26', startDate:new Date('2025-04-01'), endDate:new Date('2026-03-31'), isCurrent:true });
  await School.findByIdAndUpdate(school._id,{currentAcademicYear:ay._id});

  // Staff
  const adminUser = await User.create({ schoolId:school._id, name:'Rahul Sharma',   email:'admin@nextway.edu',          password:'Admin@2026!',     role:'school_admin', mustChangePassword:false });
  const princUser = await User.create({ schoolId:school._id, name:'Dr. Sunita Rao', email:'principal@nextway.edu',      password:'Principal@2026!', role:'principal',    mustChangePassword:false });
  const accUser   = await User.create({ schoolId:school._id, name:'Amit Kulkarni',  email:'accounts@nextway.edu',       password:'Accounts@2026!', role:'accountant',  mustChangePassword:false });

  // Teachers
  const tData=[
    {name:'Priya Verma',   email:'priya@nextway.edu'},    {name:'Amit Joshi',    email:'amit@nextway.edu'},
    {name:'Sunita Mishra', email:'sunita@nextway.edu'},   {name:'Rajesh Tiwari', email:'rajesh@nextway.edu'},
    {name:'Neha Agarwal',  email:'neha@nextway.edu'},     {name:'Vikram Singh',  email:'vikram@nextway.edu'},
    {name:'Anita Sharma',  email:'anita@nextway.edu'},    {name:'Deepak Yadav',  email:'deepak@nextway.edu'},
    {name:'Pooja Gupta',   email:'pooja.t@nextway.edu'},  {name:'Manoj Patel',   email:'manoj@nextway.edu'},
  ];
  const teachers=[];
  for(const t of tData) teachers.push(await User.create({schoolId:school._id,name:t.name,email:t.email,password:'Teacher@2026!',role:'teacher',mustChangePassword:false}));

  // Classes
  const cCfg=[{n:'Class 1',o:1},{n:'Class 2',o:2},{n:'Class 3',o:3},{n:'Class 4',o:4},{n:'Class 5',o:5},{n:'Class 6',o:6},{n:'Class 7',o:7},{n:'Class 8',o:8},{n:'Class 9',o:9},{n:'Class 10',o:10}];
  const cMap={};
  for(const c of cCfg){ const cls=await Class.create({schoolId:school._id,name:c.n,numericName:c.o,orderIndex:c.o}); cMap[c.n]=cls._id; }

  // Sections
  const sCfg=[
    ...['Class 1','Class 2','Class 3','Class 4','Class 5'].map(c=>[{c,s:'A'}]).flat(),
    ...['Class 6','Class 7','Class 8','Class 9','Class 10'].map(c=>[{c,s:'A'},{c,s:'B'}]).flat(),
  ];
  const sMap={};
  let ti=0;
  for(const sc of sCfg){
    const sec=await Section.create({schoolId:school._id,classId:cMap[sc.c],academicYearId:ay._id,name:sc.s,classTeacherId:teachers[ti%teachers.length]._id,maxStrength:50});
    sMap[`${sc.c}-${sc.s}`]=sec._id; ti++;
  }

  // Subjects
  const subList=[{n:'Mathematics',c:'MATH'},{n:'Science',c:'SCI'},{n:'English',c:'ENG'},{n:'Hindi',c:'HIN'},{n:'Social Science',c:'SST'},{n:'Computer Science',c:'CS'},{n:'Physical Education',c:'PE'}];
  const subMap={};
  for(const s of subList){ const sub=await Subject.create({schoolId:school._id,name:s.n,code:s.c}); subMap[s.n]=sub._id; }

  // Fee structures
  const fGroups=[
    {cls:['Class 1','Class 2','Class 3'], amt:8000,  heads:[{name:'Tuition Fee',amount:5000},{name:'Activity Fee',amount:1500},{name:'Library Fee',amount:500},{name:'Development Fee',amount:1000}]},
    {cls:['Class 4','Class 5'],           amt:10000, heads:[{name:'Tuition Fee',amount:6500},{name:'Lab Fee',amount:1500},{name:'Library Fee',amount:500},{name:'Development Fee',amount:1500}]},
    {cls:['Class 6','Class 7'],           amt:12000, heads:[{name:'Tuition Fee',amount:8000},{name:'Lab Fee',amount:2000},{name:'Library Fee',amount:500},{name:'Development Fee',amount:1500}]},
    {cls:['Class 8','Class 9'],           amt:15000, heads:[{name:'Tuition Fee',amount:10000},{name:'Lab Fee',amount:2000},{name:'Library Fee',amount:500},{name:'Transport Fee',amount:2500}]},
    {cls:['Class 10'],                    amt:18000, heads:[{name:'Tuition Fee',amount:12000},{name:'Lab Fee',amount:2500},{name:'Library Fee',amount:500},{name:'Board Fee',amount:3000}]},
  ];
  const fsMap={};
  for(const fg of fGroups){
    const fs=await FeeStructure.create({schoolId:school._id,academicYearId:ay._id,name:`Q1 2025-26`,heads:fg.heads,dueDate:new Date('2026-04-30')});
    fg.cls.forEach(c=>fsMap[c]={id:fs._id,amt:fg.amt,heads:fg.heads});
  }

  // Students (180 total)
  const secStudents={'Class 1-A':18,'Class 2-A':18,'Class 3-A':18,'Class 4-A':18,'Class 5-A':18,'Class 6-A':18,'Class 6-B':16,'Class 7-A':18,'Class 7-B':16,'Class 8-A':18,'Class 8-B':16,'Class 9-A':18,'Class 9-B':16,'Class 10-A':18,'Class 10-B':16};
  const allStu=[]; let seq=1, invSeq=1, rcpSeq=1;
  const feeStatusOpts=['paid','paid','paid','partial','pending','overdue'];

  for(const [sk,cnt] of Object.entries(secStudents)){
    const [cn,sn]=sk.split('-');
    const classId=cMap[cn]; const sectionId=sMap[sk];
    if(!classId||!sectionId) continue;
    const classNum=parseInt(cn.replace('Class ',''));
    for(let i=1;i<=cnt;i++){
      const g=rand(0,1)?'Male':'Female';
      const {firstName,lastName}=rName(g);
      const admNo=`NWA/2024/${pad(seq)}`;
      const sUser=await User.create({schoolId:school._id,name:`${firstName} ${lastName}`,email:`${firstName.toLowerCase()}${seq}@student.nextway.edu`,password:'Student@2026!',role:'student',mustChangePassword:false});
      const stu=await Student.create({schoolId:school._id,userId:sUser._id,academicYearId:ay._id,classId,sectionId,admissionNo:admNo,rollNo:String(i),firstName,lastName,gender:g,dateOfBirth:rDOB(classNum),bloodGroup:pick(BG),phone:rPhone(),address:{city:pick(CITIES),state:'Madhya Pradesh'},status:'active'});
      allStu.push({stu,cn,sn,classId,sectionId,classNum});

      // Fee invoice
      const fs=fsMap[cn];
      if(fs){
        const st=pick(feeStatusOpts);
        const paid=st==='paid'?fs.amt:st==='partial'?Math.floor(fs.amt*rand(3,8)/10):0;
        const inv=await FeeInvoice.create({schoolId:school._id,academicYearId:ay._id,studentId:stu._id,feeStructureId:fs.id,invoiceNo:`INV-2026-${pad(invSeq,5)}`,heads:fs.heads.map(h=>({name:h.name,amount:h.amount,discount:0,finalAmount:h.amount})),totalAmount:fs.amt,totalPaid:paid,balance:fs.amt-paid,dueDate:new Date('2026-04-30'),status:st});
        if(paid>0) await FeePayment.create({schoolId:school._id,invoiceId:inv._id,studentId:stu._id,receiptNo:`RCP-2026-${pad(rcpSeq,4)}`,amount:paid,method:pick(['Cash','UPI','Bank Transfer','Cheque','Card']),collectedById:accUser._id,paymentDate:dAgo(rand(1,30))});
        invSeq++; rcpSeq++;
      }
      seq++;
    }
  }
  console.log(`Students: ${allStu.length} | Invoices: ${invSeq-1}`);

  // Attendance (last 25 school days)
  const days=[]; for(let d=45;d>=1;d--){const dt=dAgo(d);if(dt.getDay()!==0&&dt.getDay()!==6)days.push(dt);}
  const last25=days.slice(-25);
  const bySec={};
  for(const {stu,classId,sectionId} of allStu){const k=`${classId}-${sectionId}`;if(!bySec[k])bySec[k]={classId,sectionId,stus:[]};bySec[k].stus.push(stu._id);}
  let attCnt=0;
  for(const {classId,sectionId,stus} of Object.values(bySec)){
    for(const dt of last25){
      await Attendance.create({schoolId:school._id,academicYearId:ay._id,classId,sectionId,date:dt,markedById:teachers[0]._id,period:0,records:stus.map(id=>({studentId:id,status:Math.random()>0.08?'present':Math.random()>0.5?'absent':'late'}))});
      attCnt++;
    }
  }
  console.log(`Attendance: ${attCnt} records`);

  // Exams + Results
  const examDefs=[
    {name:'Unit Test 1',type:'Unit Test',start:dAgo(120),end:dAgo(115),status:'completed',cls:['Class 6','Class 7','Class 8','Class 9','Class 10']},
    {name:'Mid Term 2025',type:'Mid Term',start:dAgo(90),end:dAgo(82),status:'completed',cls:['Class 6','Class 7','Class 8','Class 9','Class 10']},
    {name:'Final Exam 2025-26',type:'Final',start:dAgo(20),end:dAgo(10),status:'results_published',cls:['Class 6','Class 7','Class 8','Class 9','Class 10']},
    {name:'Unit Test 3',type:'Unit Test',start:new Date(Date.now()+15*864e5),end:new Date(Date.now()+20*864e5),status:'upcoming',cls:['Class 8','Class 9','Class 10']},
  ];
  const examMap={};
  for(const e of examDefs){
    const ex=await Exam.create({schoolId:school._id,academicYearId:ay._id,name:e.name,type:e.type,startDate:e.start,endDate:e.end,status:e.status,classes:e.cls.map(c=>cMap[c]).filter(Boolean),createdById:adminUser._id});
    examMap[e.name]=ex._id;
  }

  const resSubs=[{n:'Mathematics',id:subMap['Mathematics']},{n:'Science',id:subMap['Science']},{n:'English',id:subMap['English']},{n:'Hindi',id:subMap['Hindi']},{n:'Social Science',id:subMap['Social Science']}];
  let resCnt=0;
  for(const ed of examDefs.filter(e=>['completed','results_published'].includes(e.status))){
    const relevant=allStu.filter(s=>ed.cls.includes(s.cn)).slice(0,60);
    for(const {stu} of relevant){
      const marks=resSubs.map(sub=>{ const o=rand(45,98); return {subjectId:sub.id,subjectName:sub.n,maxMarks:100,obtained:o,grade:o>=90?'A+':o>=80?'A':o>=70?'B+':o>=60?'B':o>=50?'C':'D'}; });
      const tot=marks.reduce((s,m)=>s+m.obtained,0); const pct=Math.round(tot/500*100);
      await ExamResult.create({schoolId:school._id,examId:examMap[ed.name],studentId:stu._id,marks,totalMarks:500,totalObtained:tot,percentage:pct,grade:pct>=90?'A+':pct>=80?'A':pct>=70?'B+':pct>=60?'B':'C',enteredById:teachers[0]._id,isPublished:true});
      resCnt++;
    }
  }
  console.log(`Results: ${resCnt}`);

  // Homework
  const hwMap={'Mathematics':['Quadratic Equations Ex.5','Algebra Practice Set 3','Trigonometry Worksheet'],'Science':['Photosynthesis Lab Report','Chemical Reactions Notes','Physics Numericals'],'English':['Essay - My Favourite Book','Reading Comprehension 4','Grammar Worksheet'],'Hindi':['Nibandh - Hamare Tyohar','Vyakaran Abhyas'],'Social Science':['Map Work - Rivers of India','History Timeline']};
  const hwSts=['active','active','due_today','overdue'];
  for(const sk of ['Class 8-A','Class 8-B','Class 9-A','Class 10-A']){
    const [cn,sn]=sk.split('-'); const classId=cMap[cn]; const sectionId=sMap[sk];
    if(!classId||!sectionId) continue;
    for(const [subN,titles] of Object.entries(hwMap)){
      const st=pick(hwSts); const off=st==='overdue'?-rand(1,10):st==='due_today'?0:rand(1,14);
      await Homework.create({schoolId:school._id,academicYearId:ay._id,classId,sectionId,subjectId:subMap[subN],assignedById:pick(teachers)._id,title:pick(titles),description:'Complete all questions in your notebook.',dueDate:new Date(Date.now()+off*864e5),maxMarks:10,status:st==='overdue'?'closed':'active'});
    }
  }

  // Leaves
  for(const t of teachers){
    for(let i=0;i<2;i++){
      const f=dAgo(rand(1,30)); const d=rand(1,4); const to=new Date(f.getTime()+d*864e5);
      await Leave.create({schoolId:school._id,requestedById:t._id,type:pick(['Medical Leave','Casual Leave','Emergency Leave']),fromDate:f,toDate:to,days:d,reason:pick(['Medical appointment','Family function','Personal urgent work','Out of city']),status:pick(['pending','pending','approved','rejected']),reviewedById:adminUser._id,reviewedAt:new Date()});
    }
  }

  // Transport
  const routes=[
    {name:'Route 1 - Vijay Nagar',vehicleNo:'MP09 AB 1234',driverName:'Ramesh Kumar',driverPhone:'9800001111',stops:[{name:'Vijay Nagar',time:'7:15 AM',order:1},{name:'Palasia',time:'7:30 AM',order:2},{name:'School',time:'7:45 AM',order:3}]},
    {name:'Route 2 - Rajwada',vehicleNo:'MP09 CD 5678',driverName:'Suresh Singh',driverPhone:'9800002222',stops:[{name:'Rajwada',time:'7:10 AM',order:1},{name:'Chhawni',time:'7:25 AM',order:2},{name:'School',time:'7:40 AM',order:3}]},
    {name:'Route 3 - Sudama Nagar',vehicleNo:'MP09 EF 9012',driverName:'Mahesh Patel',driverPhone:'9800003333',stops:[{name:'Sudama Nagar',time:'7:20 AM',order:1},{name:'MR-10 Road',time:'7:35 AM',order:2},{name:'School',time:'7:50 AM',order:3}]},
    {name:'Route 4 - Bhawarkuan',vehicleNo:'MP09 GH 3456',driverName:'Prakash Yadav',driverPhone:'9800004444',stops:[{name:'Bhawarkuan',time:'7:05 AM',order:1},{name:'Navlakha',time:'7:20 AM',order:2},{name:'School',time:'7:35 AM',order:3}]},
  ];
  for(const r of routes) await TransportRoute.create({schoolId:school._id,...r,shift:'Both',isActive:true});

  // Hostel
  for(const r of [{roomNo:'101',building:'Block A',floor:'1',type:'Double',capacity:2},{roomNo:'102',building:'Block A',floor:'1',type:'Double',capacity:2},{roomNo:'103',building:'Block A',floor:'1',type:'Single',capacity:1},{roomNo:'201',building:'Block B',floor:'1',type:'Dormitory',capacity:6},{roomNo:'202',building:'Block B',floor:'1',type:'Triple',capacity:3},{roomNo:'301',building:'Block C',floor:'1',type:'Double',capacity:2}])
    await HostelRoom.create({schoolId:school._id,...r,isActive:true});

  // Library
  const books=[
    {title:'Mathematics Class 8',author:'R.D. Sharma',isbn:'978-81-219-0123-4',category:'Textbook',totalCopies:15,availableCopies:10,rack:'A-01'},
    {title:'Science NCERT 9',author:'NCERT',isbn:'978-81-7450-012-9',category:'Textbook',totalCopies:20,availableCopies:15,rack:'A-03'},
    {title:'The Alchemist',author:'Paulo Coelho',isbn:'978-0-06-112008-4',category:'Fiction',totalCopies:5,availableCopies:3,rack:'B-12'},
    {title:'Wings of Fire',author:'A.P.J. Abdul Kalam',isbn:'978-81-7371-146-1',category:'Biography',totalCopies:8,availableCopies:2,rack:'C-05'},
    {title:'English Grammar In Use',author:'Raymond Murphy',isbn:'978-0-521-53762-9',category:'Reference',totalCopies:10,availableCopies:7,rack:'D-02'},
    {title:'Chemistry Class 11',author:'NCERT',isbn:'978-81-7450-019-8',category:'Textbook',totalCopies:18,availableCopies:12,rack:'A-07'},
    {title:'The Jungle Book',author:'Rudyard Kipling',isbn:'978-0-14-036702-1',category:'Fiction',totalCopies:6,availableCopies:5,rack:'B-04'},
    {title:'Computer Science Class 12',author:'Sumita Arora',isbn:'978-81-318-0822-0',category:'Textbook',totalCopies:12,availableCopies:9,rack:'A-08'},
    {title:'General Knowledge 2026',author:'Manohar Pandey',isbn:'978-93-5322-117-1',category:'Reference',totalCopies:15,availableCopies:11,rack:'D-01'},
  ];
  for(const b of books) await Book.create({schoolId:school._id,...b,isActive:true});

  // Inventory
  const items=[
    {name:'Desktop Computer',category:'Electronics',quantity:45,unitPrice:35000,vendor:'TechMart Solutions',purchaseDate:new Date('2024-04-01'),condition:'Good'},
    {name:'LCD Projector',category:'Electronics',quantity:12,unitPrice:45000,vendor:'Display World',purchaseDate:new Date('2023-08-15'),condition:'Good'},
    {name:'Lab Microscope',category:'Science Equipment',quantity:20,unitPrice:8500,vendor:'SciencePro India',purchaseDate:new Date('2023-08-15'),condition:'Good'},
    {name:'Student Desk+Chair',category:'Furniture',quantity:250,unitPrice:3500,vendor:'Woodcraft Furniture',purchaseDate:new Date('2022-03-10'),condition:'Good'},
    {name:'Whiteboard 6x4ft',category:'Furniture',quantity:30,unitPrice:4500,vendor:'Boardex India',purchaseDate:new Date('2024-01-10'),condition:'New'},
    {name:'CCTV Camera',category:'Security',quantity:24,unitPrice:5500,vendor:'SecureVision',purchaseDate:new Date('2023-11-20'),condition:'Good'},
    {name:'First Aid Kit',category:'Medical',quantity:10,unitPrice:1500,vendor:'MedStore',purchaseDate:new Date('2024-01-15'),condition:'New'},
    {name:'Printer (A4)',category:'Electronics',quantity:8,unitPrice:18000,vendor:'HP India',purchaseDate:new Date('2023-06-01'),condition:'Good'},
  ];
  for(const item of items) await Inventory.create({schoolId:school._id,...item,isActive:true});

  // Notices
  const notices=[
    {title:'Annual Sports Day 2026',content:'Annual Sports Day will be held on May 15, 2026. All students must participate in at least one event. Practice sessions begin from May 1.',type:'Event',priority:'high',targetRoles:['all'],publishDate:dAgo(5)},
    {title:'Parent-Teacher Meeting',content:'PTM is scheduled for May 3, 2026 from 9:00 AM to 1:00 PM. All parents are requested to attend with their child\'s almanac.',type:'Notice',priority:'medium',targetRoles:['all'],publishDate:dAgo(8)},
    {title:'Summer Vacation Notice',content:'School will remain closed from May 20 to June 15, 2026. Students must complete vacation homework before resuming.',type:'Holiday',priority:'medium',targetRoles:['all'],publishDate:dAgo(3)},
    {title:'Unit Test 3 Schedule',content:'Unit Test 3 begins May 10, 2026. Study material available in library. Students are advised to prepare thoroughly.',type:'Exam',priority:'high',targetRoles:['all'],publishDate:dAgo(2)},
    {title:'Library Book Return Reminder',content:'All library books borrowed before March 31 must be returned by April 30. Fine of Rs.5/day for late returns.',type:'Notice',priority:'low',targetRoles:['student'],publishDate:dAgo(10)},
    {title:'Staff Meeting - May 2',content:'Monthly staff meeting on May 2 at 4:00 PM in Conference Room. Agenda: Annual report, new session planning. All staff must attend.',type:'Notice',priority:'medium',targetRoles:['teacher'],publishDate:dAgo(4)},
  ];
  for(const n of notices) await Notice.create({schoolId:school._id,...n,createdById:adminUser._id,isPublished:true});

  // Audit logs
  const audits=[
    {action:'LOGIN',entity:'User',detail:'Admin login from 192.168.1.10',userName:'Rahul Sharma'},
    {action:'CREATE',entity:'Student',detail:'New student NWA/2024/0001 created',userName:'Rahul Sharma'},
    {action:'UPDATE',entity:'Student',detail:'Class updated for NWA/2024/0015',userName:'Rahul Sharma'},
    {action:'CREATE',entity:'FeePayment',detail:'Payment RCP-2026-0001 recorded Rs.15000',userName:'Amit Kulkarni'},
    {action:'CREATE',entity:'Attendance',detail:'Attendance marked for Class 8A',userName:'Priya Verma'},
    {action:'CREATE',entity:'Homework',detail:'New assignment created for Class 8A',userName:'Priya Verma'},
    {action:'UPDATE',entity:'Leave',detail:'Leave approved for Priya Verma',userName:'Rahul Sharma'},
    {action:'EXPORT',entity:'Report',detail:'Monthly attendance report exported',userName:'Rahul Sharma'},
    {action:'CREATE',entity:'Notice',detail:'Notice published: Annual Sports Day',userName:'Rahul Sharma'},
    {action:'LOGIN',entity:'User',detail:'Teacher login successful',userName:'Amit Joshi'},
  ];
  for(let i=0;i<audits.length;i++) await AuditLog.create({schoolId:school._id,userId:adminUser._id,...audits[i],ipAddress:`192.168.1.${rand(10,50)}`,createdAt:dAgo(rand(0,7))});

  // Demo users with known credentials
  await User.create({schoolId:school._id,name:'Aarav Gupta',email:'aarav@student.nextway.edu',password:'Student@2026!',role:'student',mustChangePassword:false});
  await User.create({schoolId:school._id,name:'Suresh Gupta',email:'suresh@gmail.com',password:'Parent@2026!',role:'parent',mustChangePassword:false});

  console.log('\n' + '='.repeat(55));
  console.log('SEED COMPLETE - ' + allStu.length + ' students, ' + (invSeq-1) + ' invoices, ' + resCnt + ' results');
  console.log('='.repeat(55));
  console.log('admin@nextway.edu           | Admin@2026!');
  console.log('principal@nextway.edu       | Principal@2026!');
  console.log('priya@nextway.edu           | Teacher@2026!');
  console.log('aarav@student.nextway.edu   | Student@2026!');
  console.log('suresh@gmail.com            | Parent@2026!');
  console.log('='.repeat(55) + '\n');

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch(err => { console.error('Seed failed:', err.message); process.exit(1); });
