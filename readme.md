HLO ANNA AS YOU SAID THAT THE STUDENT DATABSE WILL BE CONNECTED FROM COLLGE I USED A CUSTOM DATABSE 
I WILL PROVIDE THE MONGODB CODE FOR ALL THE DATA 

STPES TO IMPLEMENT:
1.)OPEN MONGODB CREATE A DATABASE StudentPortalDB
IN MONGODB SHELL USING THE DATABASE AS MAIN TYPE THE FOLLWING COMMAND
-->
use StudentPortalDB

db.students.insertMany([
  {"fullName":"N.Sree Vijay","registrationNumber":"221FA0401","email":"nsreevijay@gmail.com","mobile":"9876500002","branch":"CSE","course":"B.Tech","semester":1,"admissionYear":2022,"semFees":50000},
  {"fullName":"Ananya Sharma","registrationNumber":"221FA0402","email":"ananya.sharma@example.com","mobile":"9876500002","branch":"ECE","course":"B.Tech","semester":2,"admissionYear":2022,"semFees":52000},
  {"fullName":"Rohan Verma","registrationNumber":"221FA0403","email":"rohan.verma@example.com","mobile":"9876500003","branch":"ME","course":"B.Tech","semester":3,"admissionYear":2022,"semFees":50000},
  {"fullName":"Sneha Gupta","registrationNumber":"221FA0404","email":"sneha.gupta@example.com","mobile":"9876500004","branch":"EE","course":"B.Tech","semester":4,"admissionYear":2022,"semFees":53000},
  {"fullName":"Aditya Singh","registrationNumber":"221FA0405","email":"aditya.singh@example.com","mobile":"9876500005","branch":"CE","course":"B.Tech","semester":5,"admissionYear":2022,"semFees":50000},
  {"fullName":"Priya Reddy","registrationNumber":"221FA0406","email":"priya.reddy@example.com","mobile":"9876500006","branch":"CSE","course":"B.Tech","semester":6,"admissionYear":2022,"semFees":51000},
  {"fullName":"Karthik Rao","registrationNumber":"221FA0407","email":"karthik.rao@example.com","mobile":"9876500007","branch":"ME","course":"B.Tech","semester":7,"admissionYear":2022,"semFees":50000},
  {"fullName":"Shivani Jain","registrationNumber":"221FA0408","email":"shivani.jain@example.com","mobile":"9876500008","branch":"CSE","course":"B.Tech","semester":8,"admissionYear":2022,"semFees":52000},
  {"fullName":"Manish Kumar","registrationNumber":"221FA0409","email":"manish.kumar@example.com","mobile":"9876500009","branch":"EE","course":"B.Tech","semester":1,"admissionYear":2022,"semFees":50000},
  {"fullName":"Ritika Desai","registrationNumber":"221FA0410","email":"ritika.desai@example.com","mobile":"9876500010","branch":"CE","course":"B.Tech","semester":2,"admissionYear":2022,"semFees":53000},
  {"fullName":"Amitabh Singh","registrationNumber":"221FA0411","email":"amitabh.singh@example.com","mobile":"9876500011","branch":"ME","course":"B.Tech","semester":3,"admissionYear":2022,"semFees":50000},
  {"fullName":"Divya Menon","registrationNumber":"221FA0412","email":"divya.menon@example.com","mobile":"9876500012","branch":"ECE","course":"B.Tech","semester":4,"admissionYear":2022,"semFees":52000},
  {"fullName":"Harsh Patel","registrationNumber":"221FA0413","email":"harsh.patel@example.com","mobile":"9876500013","branch":"CSE","course":"B.Tech","semester":5,"admissionYear":2022,"semFees":50000},
  {"fullName":"Sanya Kapoor","registrationNumber":"221FA0414","email":"sanya.kapoor@example.com","mobile":"9876500014","branch":"EE","course":"B.Tech","semester":6,"admissionYear":2022,"semFees":53000},
  {"fullName":"Kunal Mehta","registrationNumber":"221FA0415","email":"kunal.mehta@example.com","mobile":"9876500015","branch":"CE","course":"B.Tech","semester":7,"admissionYear":2022,"semFees":50000},
  {"fullName":"Nikita Shah","registrationNumber":"221FA0416","email":"nikita.shah@example.com","mobile":"9876500016","branch":"ME","course":"B.Tech","semester":8,"admissionYear":2022,"semFees":51000},
  {"fullName":"Raghav Malhotra","registrationNumber":"221FA0417","email":"raghav.malhotra@example.com","mobile":"9876500017","branch":"CSE","course":"B.Tech","semester":1,"admissionYear":2022,"semFees":50000},
  {"fullName":"Pooja Bhatt","registrationNumber":"221FA0418","email":"pooja.bhatt@example.com","mobile":"9876500018","branch":"ECE","course":"B.Tech","semester":2,"admissionYear":2022,"semFees":52000},
  {"fullName":"Tarun Goel","registrationNumber":"221FA0419","email":"tarun.goel@example.com","mobile":"9876500019","branch":"EE","course":"B.Tech","semester":3,"admissionYear":2022,"semFees":50000},
  {"fullName":"Meera Nair","registrationNumber":"221FA0420","email":"meera.nair@example.com","mobile":"9876500020","branch":"CE","course":"B.Tech","semester":4,"admissionYear":2022,"semFees":53000},
  {"fullName":"Arjun Deshmukh","registrationNumber":"221FA0421","email":"arjun.deshmukh@example.com","mobile":"9876500021","branch":"ME","course":"B.Tech","semester":5,"admissionYear":2022,"semFees":50000},
  {"fullName":"Ishita Raina","registrationNumber":"221FA0422","email":"ishita.raina@example.com","mobile":"9876500022","branch":"CSE","course":"B.Tech","semester":6,"admissionYear":2022,"semFees":52000},
  {"fullName":"Vikram Choudhary","registrationNumber":"221FA0423","email":"vikram.choudhary@example.com","mobile":"9876500023","branch":"ECE","course":"B.Tech","semester":7,"admissionYear":2022,"semFees":50000},
  {"fullName":"Sakshi Agarwal","registrationNumber":"221FA0424","email":"sakshi.agarwal@example.com","mobile":"9876500024","branch":"EE","course":"B.Tech","semester":8,"admissionYear":2022,"semFees":53000},
  {"fullName":"Ritesh Kumar","registrationNumber":"221FA0425","email":"ritesh.kumar@example.com","mobile":"9876500025","branch":"CE","course":"B.Tech","semester":1,"admissionYear":2022,"semFees":50000},
  {"fullName":"Tanvi Joshi","registrationNumber":"221FA0426","email":"tanvi.joshi@example.com","mobile":"9876500026","branch":"ME","course":"B.Tech","semester":2,"admissionYear":2022,"semFees":51000},
  {"fullName":"Aakash Sinha","registrationNumber":"221FA0427","email":"aakash.sinha@example.com","mobile":"9876500027","branch":"CSE","course":"B.Tech","semester":3,"admissionYear":2022,"semFees":50000},
  {"fullName":"Neha Arora","registrationNumber":"221FA0428","email":"neha.arora@example.com","mobile":"9876500028","branch":"ECE","course":"B.Tech","semester":4,"admissionYear":2022,"semFees":52000},
  {"fullName":"Raghav Bansal","registrationNumber":"221FA0429","email":"raghav.bansal@example.com","mobile":"9876500029","branch":"EE","course":"B.Tech","semester":5,"admissionYear":2022,"semFees":50000},
  {"fullName":"Aditi Kapoor","registrationNumber":"221FA0430","email":"aditi.kapoor@example.com","mobile":"9876500030","branch":"CE","course":"B.Tech","semester":6,"admissionYear":2022,"semFees":53000},
  {"fullName":"Siddharth Malhotra","registrationNumber":"221FA0431","email":"siddharth.malhotra@example.com","mobile":"9876500031","branch":"ME","course":"B.Tech","semester":7,"admissionYear":2022,"semFees":50000},
  {"fullName":"Shreya Nair","registrationNumber":"221FA0432","email":"shreya.nair@example.com","mobile":"9876500032","branch":"CSE","course":"B.Tech","semester":8,"admissionYear":2022,"semFees":52000},
  {"fullName":"Aman Verma","registrationNumber":"221FA0433","email":"aman.verma@example.com","mobile":"9876500033","branch":"ECE","course":"B.Tech","semester":1,"admissionYear":2022,"semFees":50000},
  {"fullName":"Richa Sharma","registrationNumber":"221FA0434","email":"richa.sharma@example.com","mobile":"9876500034","branch":"EE","course":"B.Tech","semester":2,"admissionYear":2022,"semFees":53000},
  {"fullName":"Karan Mehta","registrationNumber":"221FA0435","email":"karan.mehta@example.com","mobile":"9876500035","branch":"CE","course":"B.Tech","semester":3,"admissionYear":2022,"semFees":50000},
  {"fullName":"Anjali Reddy","registrationNumber":"221FA0436","email":"anjali.reddy@example.com","mobile":"9876500036","branch":"ME","course":"B.Tech","semester":4,"admissionYear":2022,"semFees":51000},
  {"fullName":"Vivek Choudhary","registrationNumber":"221FA0437","email":"vivek.choudhary@example.com","mobile":"9876500037","branch":"CSE","course":"B.Tech","semester":5,"admissionYear":2022,"semFees":50000},
  {"fullName":"Isha Agarwal","registrationNumber":"221FA0438","email":"isha.agarwal@example.com","mobile":"9876500038","branch":"ECE","course":"B.Tech","semester":6,"admissionYear":2022,"semFees":52000},
  {"fullName":"Rahul Sinha","registrationNumber":"221FA0439","email":"rahul.sinha@example.com","mobile":"9876500039","branch":"EE","course":"B.Tech","semester":7,"admissionYear":2022,"semFees":50000},
  {"fullName":"Megha Joshi","registrationNumber":"221FA0440","email":"megha.joshi@example.com","mobile":"9876500040","branch":"CE","course":"B.Tech","semester":8,"admissionYear":2022,"semFees":53000},
  {"fullName":"Nikhil Kumar","registrationNumber":"221FA0441","email":"nikhil.kumar@example.com","mobile":"9876500041","branch":"ME","course":"B.Tech","semester":1,"admissionYear":2022,"semFees":50000},
  {"fullName":"Shruti Verma","registrationNumber":"221FA0442","email":"shruti.verma@example.com","mobile":"9876500042","branch":"CSE","course":"B.Tech","semester":2,"admissionYear":2022,"semFees":52000},
  {"fullName":"Pranav Malhotra","registrationNumber":"221FA0443","email":"pranav.malhotra@example.com","mobile":"9876500043","branch":"ECE","course":"B.Tech","semester":3,"admissionYear":2022,"semFees":50000},
  {"fullName":"Tanya Sharma","registrationNumber":"221FA0444","email":"tanya.sharma@example.com","mobile":"9876500044","branch":"EE","course":"B.Tech","semester":4,"admissionYear":2022,"semFees":53000},
  {"fullName":"Arnav Mehta","registrationNumber":"221FA0445","email":"arnav.mehta@example.com","mobile":"9876500045","branch":"CE","course":"B.Tech","semester":5,"admissionYear":2022,"semFees":50000},
  {"fullName":"Ayesha Reddy","registrationNumber":"221FA0446","email":"ayesha.reddy@example.com","mobile":"9876500046","branch":"ME","course":"B.Tech","semester":6,"admissionYear":2022,"semFees":51000},
  {"fullName":"Devansh Choudhary","registrationNumber":"221FA0447","email":"devansh.choudhary@example.com","mobile":"9876500047","branch":"CSE","course":"B.Tech","semester":7,"admissionYear":2022,"semFees":50000},
  {"fullName":"Radhika Agarwal","registrationNumber":"221FA0448","email":"radhika.agarwal@example.com","mobile":"9876500048","branch":"ECE","course":"B.Tech","semester":8,"admissionYear":2022,"semFees":52000},
  {"fullName":"Aditya Sinha","registrationNumber":"221FA0449","email":"aditya.sinha@example.com","mobile":"9876500049","branch":"EE","course":"B.Tech","semester":1,"admissionYear":2022,"semFees":50000},
  {"fullName":"Isha Kapoor","registrationNumber":"221FA0450","email":"isha.kapoor@example.com","mobile":"9876500050","branch":"CE","course":"B.Tech","semester":2,"admissionYear":2022,"semFees":53000}
]);



2.) now open the backedn in the terminal and run 2 comands:
    i.)npm start
    ii.)npm run dev

3.)now open the frentend int he terminal and run 1 command:
    npm run dev
