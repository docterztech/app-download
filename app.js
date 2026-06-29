const params=new URLSearchParams(window.location.search);
const app=params.get("app");
fetch("apps.json")
.then(r=>r.json())
.then(data=>{
 if(!app||!data[app]){
   document.getElementById("status").innerHTML="Application not found.";
   return;
 }
 const ua=navigator.userAgent;
 if(/android/i.test(ua)){
   location.href=data[app].android;
 }else if(/iPad|iPhone|iPod/i.test(ua)){
   location.href=data[app].ios;
 }else{
   document.body.innerHTML=`
   <h2>Select your platform</h2>
   <p><a href="${data[app].android}">Android</a></p>
   <p><a href="${data[app].ios}">iPhone</a></p>`;
 }
})
.catch(()=>{
 document.getElementById("status").innerHTML="Unable to load app list.";
});
