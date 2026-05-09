async function loadCourses(){
const container=document.getElementById("courses-container");
if(!container)return;
const res=await fetch("assets/json/courses.json");
const data=await res.json();
data.forEach(c=>{
const div=document.createElement("div");
div.className="card";
div.innerHTML=`<h3>${c.title}</h3><p>${c.description}</p>`;
container.appendChild(div);
});
}
loadCourses();
