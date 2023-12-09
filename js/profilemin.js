const token=localStorage.getItem("token"),baseUrl="https://tarmeezacademy.com/api/v1",id=new URLSearchParams(window.location.search).get("id");function preloader(e="off"){"on"==e?document.getElementById("preloader").style.visibility="visible":"off"==e&&(document.getElementById("preloader").style.visibility="hidden")}function showAlert(e,t){const o=document.getElementById("liveAlertPlaceholder");((e,t)=>{const n=document.createElement("div");n.innerHTML=[`<div class="alert alert-${t} alert-dismissible" role="alert">`,`   <div>${e}</div>`,'   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',"</div>"].join(""),o.append(n)})(e,t)}function authnUI(){const e=document.getElementById("guest"),t=document.getElementById("nav-user");if(null===localStorage.getItem("token"))t.style.setProperty("display","none","important"),e.style.display="flex";else{t.style.setProperty("display","flex","important"),e.style.setProperty("display","none","important");let o=currentUser();document.getElementById("user-pic").src=o.profile_image,document.getElementById("user-username").innerHTML=o.username}}function registerUser(){let e=new FormData;e.append("image",document.getElementById("reg-image").files[0]),e.append("username",document.getElementById("reg-username").value),e.append("password",document.getElementById("reg-password").value),e.append("name",document.getElementById("reg-name").value),e.append("email",document.getElementById("reg-email").value),axios.post(`${baseUrl}/register`,e).then((e=>{localStorage.setItem("token",e.data.data.token),localStorage.setItem("user",JSON.stringify(e.data.user)),bootstrap.Modal.getInstance(document.getElementById("reg-modal")).hide(),authnUI(),showAlert("User registered successfully","success")})).catch((e=>{showAlert(e.response.data.error,"danger")}))}function currentUser(){let e="";return null!==localStorage.getItem("user")&&(e=JSON.parse(localStorage.getItem("user"))),e}function signInUser(){const e={username:document.getElementById("lgn-username").value,password:document.getElementById("lgn-password").value};axios.post(`${baseUrl}/login`,e,{headers:{Accept:"application/json"}}).then((e=>{localStorage.setItem("token",e.data.token),localStorage.setItem("user",JSON.stringify(e.data.user)),bootstrap.Modal.getInstance(document.getElementById("sgnin-modal")).hide(),authnUI(),showAlert("Logged in successfully","success")})).catch((e=>{}))}function logout(){localStorage.removeItem("token"),authnUI(),showAlert("logged out successfully","success")}function addNewPost(){const e=document.getElementById("create-post-title").value,t=document.getElementById("create-post-body").value,o=document.getElementById("create-post-image").files[0],n=new FormData;n.append("title",e),n.append("body",t),n.append("image",o),axios.post(`${baseUrl}/posts`,n,{headers:{authorization:`Bearer ${token}`}}).then((e=>{bootstrap.Modal.getInstance(document.getElementById("create-post-modal")).hide(),getPosts("on",1),showAlert("Your post has been created successfully","success")})).catch((e=>{showAlert(e,"danger")}))}function addNewComment(){const e=document.getElementById("comment-post-id").value;let t={body:document.getElementById("comment-body").value};axios.post(`${baseUrl}/posts/${e}/comments`,t,{headers:{authorization:`Bearer ${token}`}}).then((t=>{showAlert("Your comment has been created successfully","success"),getComments(e,"on")})).catch((e=>{showAlert(e.response.data.message,"danger")}))}function editTrigger(e){document.getElementById("edit-post-id").value=e,new bootstrap.Modal(document.getElementById("edit-post-modal")).toggle()}function updatePost(){const e=document.getElementById("edit-post-id").value;let t=new FormData;t.append("image",document.getElementById("edit-post-image").files[0]),t.append("title",document.getElementById("edit-post-title").value),t.append("body",document.getElementById("edit-post-body").value),t.append("_method","put"),axios.post(`${baseUrl}/posts/${e}`,t,{headers:{Authorization:`Bearer ${token}`}}).then((e=>{showAlert("You post has been updated successfully","success");bootstrap.Modal.getInstance(document.getElementById("edit-post-modal")).hide(),getPosts("on",1)})).catch((e=>{showAlert(e.response.data.message,"danger")}))}function deleteTrigger(e){document.getElementById("delete-post-id").value=e,new bootstrap.Modal(document.getElementById("delete-post-modal")).toggle()}function deleteConfirmed(){const e=document.getElementById("delete-post-id").value;axios.delete(`${baseUrl}/posts/${e}`,{headers:{authorization:`Bearer ${token}`}}).then((e=>{showAlert("Your post has been deleted successfully","success"),bootstrap.Modal.getInstance(document.getElementById("delete-post-modal")).hide(),getPosts("on",1)}))}function getProfileInfo(){axios.get(`${baseUrl}/users/${id}`).then((e=>{const t=e.data.data;let o="";o=""===Object.values(t.profile_image).join("")?"../imgs/nobody.png":t.profile_image,document.getElementById("profile-user-image").src=o,document.getElementById("profile-username").innerHTML=t.username,document.getElementById("profile-name").innerHTML=t.name,document.getElementById("posts-count").innerHTML=t.posts_count,document.getElementById("comments-count").innerHTML=t.comments_count}))}function getPosts(e="off",t=1){preloader("on");const o=document.getElementById("posts-container");"on"===e&&(o.innerHTML="");let n="";axios.get(`${baseUrl}/users/${id}/posts`).then((e=>{const t=e.data.data;0==t.length&&(o.innerHTML="",preloader("off"));for(let e of t){let t,l;t=""===Object.values(e.image).join("")?"../imgs/noimage.jpg":e.image,l=""===Object.values(e.author.profile_image).join("")?"../imgs/nobody.png":e.author.profile_image;let s=currentUser();let c="";e.author.id===s.id&&(c=`\n                <button class="btn btn-primary btn-sm me-1" onclick="editTrigger(${e.id})">\n                    <i class="bi  bi-pencil-square"></i>\n                </button>\n                <button class="btn btn-danger btn-sm" onclick="deleteTrigger(${e.id})"><i class="bi bi-trash"></i></button>\n                `),n=`\n            <div class="post mb-5 shadow rounded">\n                <div class="card">\n                    <div class="card-header post-header d-flex justify-content-between align-items-center">\n                        <div>\n                            <img onclick="viewProfile(${e.author.id})" id="post-user-image" loading ="lazy" class="temp-pp" src="${l}" />\n                            <b  onclick="viewProfile(${e.author.id})"id="post-user-name" class="temp-user fs-6">${e.author.name}</b>\n                        </div>\n                        <div>${c}</div>\n                        </div>\n                        <div class="card-body post-bdy">\n                        <div class="skeleton">\n                            <img\n                            id="post-main-image"\n                            class="w-100"\n                            src="${t}"\n                            loading ="lazy"\n                                />\n                        </div>\n\n                        <div class="post-text mt-4 skeleton">\n                                <p style="color:grey;font-size:12px;" >${e.created_at}</p>\n                                <b class="fs-3">${""!==e.title?e.title:"no title"}</b>\n                                <p class="mt-3">\n                                    ${""!==e.body?e.body:"body is empty"}\n                                </p>\n                                \n                                <hr style="color:#4e4e4e"/>\n                                <div \n                                class = "comment-container" \n                                data-bs-toggle="modal" \n                                data-bs-target="#comments"\n                                style = "cursor:pointer;"\n                                onclick = "getComments(${e.id})"\n                                >\n                                    <i class="bi bi-chat-dots"></i>\n                                    <span>(${e.comments_count}) Comments</span>\n                                </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            \n            `,o.innerHTML+=n,document.getElementById("dark-mode").checked?(document.body.style.backgroundColor="#18191a",document.getElementById("nav-bar").style.backgroundColor="#242526",document.querySelectorAll(".nav-txt-color").forEach((e=>{e.style.cssText="color:white;"})),document.querySelectorAll(".card").forEach((e=>{e.style.cssText="background-color:#242526;color:white"})),document.querySelectorAll(".modal-content").forEach((e=>{e.style.cssText="background-color:#18191a;color:#fff;"})),document.querySelectorAll(".btn-close").forEach((e=>{e.style.cssText="filter:invert(1);"}))):document.getElementById("dark-mode").checked||(document.body.style.backgroundColor="#f0f2f5",document.querySelectorAll(".nav-txt-color").forEach((e=>{e.style.cssText="color:black;"})),document.querySelectorAll(".card").forEach((e=>{e.style.cssText="background-color:#ffffff;color:black"})),document.querySelectorAll(".modal-content").forEach((e=>{e.style.cssText="background-color:#ffffff;color:black"})),document.querySelectorAll(".btn-close").forEach((e=>{e.style.cssText="filter:invert(0);"})))}preloader("off")})).then((()=>{null!=document.getElementById("main-loader")&&document.getElementById("main-loader").remove()}))}function getComments(e,t="off"){document.getElementById("comment-post-id").value=e,axios.get(`${baseUrl}/posts/${e}`).then((e=>{"on"===t&&(document.getElementById("all-comments").innerHTML="");const o=e.data.data.comments;if(e.data.data.comments.length<1)document.getElementById("all-comments").innerHTML="<P> no comments yet</P>",document.getElementById("all-comments").innerHTML+="<img class='w-50 no-comment-img' src='../imgs/nocomments.png'/>",document.querySelector("#all-comments p").style.cssText="position:absolute;top:70%;left:50%;transform:translateX(-50%);",document.querySelector("#all-comments img").style.cssText="position:absolute;left:50%;transform:translatex(-50%)","on"===localStorage.getItem("dark-mode")?(document.getElementById("comments-color").style.setProperty("background-color","#18191a"),document.getElementById("comments-color").style.setProperty("color","#fff"),document.getElementById("comment-body").style.setProperty("background-color","#242526"),document.getElementById("comment-body").style.setProperty("color","#fff"),document.getElementById("comment-body").classList.add("drk-input")):(document.getElementById("comments-color").style.setProperty("background-color","#fff"),document.getElementById("comments-color").style.setProperty("color","#000"),document.getElementById("comment-body").style.setProperty("background-color","#fff"),document.getElementById("comment-body").style.setProperty("color","#000"),document.getElementById("comment-body").classList.remove("drk-input"));else{document.getElementById("all-comments").innerHTML="";for(let e of o){const t=e.author.username,o=e.author.profile_image;""===Object.values(e.author.profile_image).join("")?profilePic="../imgs/nobody.png":profilePic=e.author.profile_image;const n=e.body;let l=`\n                <div class="comment d-flex w-100 mb-3">\n                    <img id="post-user-image" class="temp-pp mt-2" src="${o}" onclick="viewProfile(${e.author.id})" />\n                    <div class="card p-3 w-100 shadow the-comment">\n                        <div class="post-header ">\n                            <b id="post-user-name" class="temp-user fs-7" onclick="viewProfile(${e.author.id})">@${t}</b>\n                        </div>\n                        <div class="post-text">\n                            <p class="mt-3">\n                                ${n}\n                            </p>\n                        </div>\n                    </div>\n                </div>\n                `;document.getElementById("all-comments").innerHTML+=l,"on"===localStorage.getItem("dark-mode")?(document.getElementById("comments-color").style.setProperty("background-color","#18191a"),document.getElementById("comments-color").style.setProperty("color","#fff"),document.getElementById("comment-body").style.setProperty("background-color","#242526"),document.getElementById("comment-body").style.setProperty("color","#fff"),document.getElementById("comment-body").classList.add("drk-input"),document.querySelectorAll(".the-comment").forEach((e=>{e.style.cssText="background-color:#242526;color:#fff"}))):(document.getElementById("comments-color").style.setProperty("background-color","#f0f2f5"),document.getElementById("comments-color").style.setProperty("color","#000"),document.getElementById("comment-body").style.setProperty("background-color","#f0f2f5"),document.getElementById("comment-body").style.setProperty("color","#000"),document.getElementById("comment-body").classList.remove("drk-input"),document.querySelectorAll(".the-comment").forEach((e=>{e.style.cssText="background-color:#fff;color:#000"})))}}})).catch((e=>{}))}function viewProfile(e){window.location=`../pages/profile.html?id=${e}`}function viewMyProfile(){const e=currentUser().id;window.location=`../pages/profile.html?id=${e}`}function checkDarkMode(){"on"===localStorage.getItem("dark-mode")?(document.getElementById("dark-mode").checked=!0,document.querySelector(".navbar-toggler-icon").style.cssText="filter:invert(1);"):(document.getElementById("dark-mode").checked=!1,document.querySelector(".navbar-toggler-icon").style.cssText="filter:invert(0);")}function darkMode(){document.getElementById("dark-mode").checked?(document.body.style.backgroundColor="#18191a",document.getElementById("nav-bar").style.backgroundColor="#242526",document.querySelectorAll(".nav-txt-color").forEach((e=>{e.style.cssText="color:white;"})),document.querySelectorAll(".card").forEach((e=>{e.style.cssText="background-color:#242526;color:white"})),document.querySelectorAll(".modal-content").forEach((e=>{e.style.cssText="background-color:#18191a;color:#fff;"})),document.querySelector(".navbar-toggler-icon").style.cssText="filter:invert(1);",document.querySelectorAll("input").forEach((e=>{e.classList.add("drk-input")})),document.querySelectorAll("textarea").forEach((e=>{e.classList.add("drk-input")})),localStorage.setItem("dark-mode","on")):document.getElementById("dark-mode").checked||(document.body.style.backgroundColor="#f0f2f5",document.getElementById("nav-bar").style.backgroundColor="#ffffff",document.querySelectorAll(".nav-txt-color").forEach((e=>{e.style.cssText="color:black;"})),document.querySelectorAll(".card").forEach((e=>{e.style.cssText="background-color:#ffffff;color:black"})),document.querySelectorAll(".modal-content").forEach((e=>{e.style.cssText="background-color:#ffffff;color:black"})),document.querySelector(".navbar-toggler-icon").style.cssText="filter:invert(0);",document.querySelectorAll("input").forEach((e=>{e.classList.remove("drk-input")})),document.querySelectorAll("textarea").forEach((e=>{e.classList.remove("drk-input")})),localStorage.setItem("dark-mode","off"))}checkDarkMode(),authnUI(),getProfileInfo(),getPosts(),document.getElementById("reg-user").addEventListener("click",registerUser),document.getElementById("log-me-in").addEventListener("click",signInUser),document.getElementById("lg-out-btn").addEventListener("click",logout),darkMode(),document.getElementById("dark-mode").addEventListener("click",darkMode);