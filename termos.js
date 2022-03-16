const App={viewport:null,viewport_width:0,pages_container:null,nr_pages:0,lst_pages:null,current_page_idx:null,client_onResize:null,mouse_or_touch:null,Init:function(t){this.viewport=document.getElementById("AppViewport"),this.pages_container=document.getElementById("AppPagesContainer"),this.lst_pages=Array.from(document.querySelectorAll(".AppPage")),this.nr_pages=this.lst_pages.length,window.hasOwnProperty("cordova")?this.mouse_or_touch="mousedown":this.mouse_or_touch=void 0!==window.ontouchstart?"touchstart":"mousedown",App.onResize(null),this.client_onResize=t,window.visualViewport.addEventListener("resize",App.onResize.bind(App))},onResize:function(t){this.viewport_width=this.viewport.offsetWidth,this.viewport.style.height=window.visualViewport.height+"px",this.pages_container.style.width=this.nr_pages*this.viewport_width+"px",this.pages_container.style.left=-this.current_page_idx*this.viewport.offsetWidth+"px",this.lst_pages.forEach(t=>t.style.width=this.viewport_width+"px"),null!==this.client_onResize&&this.client_onResize(this.viewport_width,this.viewport.offsetHeight)},GetWidth:function(){return this.viewport_width},GetHeight:function(){return this.viewport.offsetHeight},ShowPage:function(t){if("string"==typeof t)for(var e=0;e<this.nr_pages;){if(this.lst_pages[e].id===t){t=e;break}e++}this.pages_container.style.left=-t*this.viewport.offsetWidth+"px",this.current_page_idx=t},AddEventListener:function(t,e,s){"MOUSE||TOUCH"===e&&(e=this.mouse_or_touch),t.addEventListener(e,s)},Clock:{seconds:0,timer:null}},FADE_OUT=(App.Clock.Start=function(){this.seconds=0,clearInterval(this.timer),this.timer=setInterval(App.Clock.Tick.bind(App.Clock),1e3)},App.Clock.Tick=function(){this.seconds+=1},App.Clock.Stop=function(){return clearInterval(this.timer),this.seconds},App.Clock.GetSeconds=function(){return this.seconds},App.Clock.GetTime=function(t=-1){-1===t&&(t=this.seconds);var e=Math.round(t%60)+'"',t=Math.floor(t/60);return e=0<t?t+"'"+e:e},App.Loader={TEXT_LIST:0,AUDIO_LIST:1,IMAGE_LIST:2,JSON_LIST:3,TYPE_BLOB:0,TYPE_TEXT:1,TYPE_JSON:2,API_FETCH:0,API_XHR:1,tasks:{lst:[],doing:!1,time:0,nr_bytes:0,nr_items_total:0,nr_items_loaded:0,id:0,fnTicker:null,verbose:!0},api:0},App.Loader.ListTypeToString=function(t){return["TEXT","AUDIO","IMAGE","JSON"][t]},App.Loader.ResponseTypeToString=function(t){return["BLOB","TEXT","JSON"][t]},App.Loader.ApiToString=function(t){return["FECTCH","XHR"][t]},App.Loader.SetAPI=function(t){this.api=t===this.API_XHR?this.API_XHR:this.API_FETCH,this.api===this.API_XHR&&"function"!=typeof atomic&&(this.api=this.API_FETCH)},App.Loader.LoadURL=function(t,e,s){const i=this.tasks.doing&&this.tasks.id===e;var o;return i&&this.tasks.verbose,(this.api===this.API_FETCH?fetch(t):(o={},s===this.TYPE_BLOB?o.responseType="blob":s===this.TYPE_TEXT?o.responseType="text":s===this.TYPE_JSON&&(o.responseType="json"),atomic(t,o))).then(t=>this.CheckStatus(t,e,i))},App.Loader.GetResponseStatus=function(t){return(this.api===this.API_FETCH?t:t.xhr).status},App.Loader.GetResponseStatusText=function(t){return(this.api===this.API_FETCH?t:t.xhr).statusText},App.Loader.GetResponseURL=function(t){return this.api===this.API_FETCH?t.url:t.xhr.responseURL},App.Loader.GetResponseHeader=function(t,e){return this.api===this.API_FETCH?t.headers.get(e):t.xhr.getResponseHeader(e)},App.Loader.CheckStatus_LogResponse=function(t){this.GetResponseStatus(t),this.GetResponseStatusText(t),this.GetResponseHeader(t,"Content-Length"),this.GetResponseHeader(t,"Content-Type"),this.GetResponseURL(t)},App.Loader.CheckStatus=function(t,e,s){s&&!this.tasks.verbose||this.CheckStatus_LogResponse(t);var i=(this.api===this.API_FETCH?t:t.xhr).status;return 200<=i&&i<=299?(s&&(this.tasks.nr_items_loaded+=1,this.tasks.nr_bytes+=parseInt(this.GetResponseHeader(t,"Content-Length"),10),null!==this.tasks.fnTicker&&this.tasks.fnTicker(this.tasks.nr_items_loaded,this.tasks.nr_items_total)),Promise.resolve(t)):Promise.reject({status:this.GetResponseStatus(t),statusText:this.GetResponseStatusText(t),URL:this.GetResponseURL(t)})},App.Loader.GetText=function(t){return App.Loader.api===App.Loader.API_FETCH?t.text():t.data},App.Loader.GetBLOB=function(t){return App.Loader.api===App.Loader.API_FETCH?t.blob():t.data},App.Loader.GetJSON=function(t){var e=App.Loader.GetResponseHeader(t,"Content-Type");if("application/json"!==e)throw new Error("GetJSON >> Content-Type: "+e);return App.Loader.api===App.Loader.API_FETCH?t.json():t.data},App.Loader.MakeImageFromBlob=function(t){if(!t.type.startsWith("image"))throw new Error("MakeImageFromBlob >> BLOB type: "+t.type);var e=document.createElement("img");return e.src=URL.createObjectURL(t),e.onload=function(){URL.revokeObjectURL(this.src)},e},App.Loader.MakeAudioFromBlob=function(t){if(!t.type.startsWith("audio"))throw new Error("MakeAudioFromBlob >> BLOB type: "+t.type);var e=document.createElement("audio");return e.src=URL.createObjectURL(t),e.onload=function(){URL.revokeObjectURL(this.src)},e},App.Loader.LoadAndProcessBlob=function(t,e,s){return App.Loader.LoadURL(t,e,App.Loader.TYPE_BLOB).then(App.Loader.GetBLOB).then(s)},App.Loader.LoadImage=function(t,e=null){return App.Loader.LoadAndProcessBlob(t,e,App.Loader.MakeImageFromBlob)},App.Loader.LoadAudio=function(t,e){return App.Loader.LoadAndProcessBlob(t,e,App.Loader.MakeAudioFromBlob)},App.Loader.LoadJSON=function(t,e=null){return App.Loader.LoadURL(t,e,App.Loader.TYPE_JSON).then(App.Loader.GetJSON)},App.Loader.LoadText=function(t,e=null){return App.Loader.LoadURL(t,e,App.Loader.TYPE_TEXT).then(App.Loader.GetText)},App.Loader.LoadList=function(t,e,s,i,o){if(!(t instanceof Array))return t;var r=[],n=[],t=(t.forEach(t=>{r.push(t[0]),n.push(e+t[1])}),n.map(t=>s(t,i)));return Promise.all(t).then(t=>{for(var e={},s=t.length-1;0<=s;)e[r[s]]=t[s],--s;return e}).catch(t=>{throw t})},App.Loader.MakeList=function(t,e,s,i){t=this.Object2ListOfPairs(t);if(this.tasks.doing)this.tasks.id===e&&(this.tasks.nr_items_total+=t.length);else try{this.VerifyTaskList(t,null,i,[])}catch(t){return Promise.reject(t)}return t},App.Loader.LoadAudioList=function(t,e="",s=null,i=null){return App.Loader.LoadList(this.MakeList(t,s,i,e),e,this.LoadAudio,s,i)},App.Loader.LoadImageList=function(t,e="",s=null,i=null){return App.Loader.LoadList(this.MakeList(t,s,i,e),e,this.LoadImage,s,i)},App.Loader.LoadJsonList=function(t,e="",s=null,i=null){return App.Loader.LoadList(this.MakeList(t,s,i,e),e,this.LoadJSON,s,i)},App.Loader.LoadTextList=function(t,e="",s=null,i=null){return App.Loader.LoadList(this.MakeList(t,s,i,e),e,this.LoadText,s,i)},App.Loader.AddTask=function(t,e,s,i=""){return this.tasks.doing?0:(this.tasks.lst.push({id:t,type:e,list:s,prefix:i}),this.tasks.lst.length)},App.Loader.Task2Promise=function(t,e){switch(App.Loader.tasks.verbose,t.type){default:return Promise.reject(new Error("Task2Promise >> Type: "+t.type));case this.AUDIO_LIST:return this.LoadAudioList(t.list,t.prefix,e,t.id);case this.IMAGE_LIST:return this.LoadImageList(t.list,t.prefix,e,t.id);case this.JSON_LIST:return this.LoadJsonList(t.list,t.prefix,e,t.id);case this.TEXT_LIST:return this.LoadTextList(t.list,t.prefix,e,t.id)}},App.Loader.DoTasks=function(t,e=!1){if(this.tasks.doing)return null;var s=this.VerifyTasks();if(null!==s)return s;this.tasks.doing=!0,this.tasks.verbose=e,this.tasks.fnTicker="function"==typeof t?t:null,this.tasks.nr_bytes=0,this.tasks.nr_items_total=0,this.tasks.nr_items_loaded=0,this.tasks.time=Date.now(),this.tasks.id=Date.now();s=this.tasks.lst.map(t=>this.Task2Promise(t,this.tasks.id));return Promise.all(s).then(t=>{App.Loader.tasks.time=Date.now()-App.Loader.tasks.time;for(var e={},s=0;s<t.length;++s)e[App.Loader.tasks.lst[s].id]=t[s];return App.Loader.CleanTasks(),App.Loader.tasks.doing=!1,e}).catch(t=>{throw t})},App.Loader.VerifyTasks=function(){for(var t,e=this.tasks.lst,s=[],i=0;i<e.length;++i){t=e[i];try{this.VerifyTaskList(this.Object2ListOfPairs(t.list),t.id,t.prefix,s)}catch(t){return Promise.reject(t)}}return null},App.Loader.VerifyTaskList=function(s,i,t,e){function o(t,e){throw new Error("App.Loader >> "+t+" >> Pair: "+s[e]+" Task: "+i+" Idx: "+e)}for(var r,n,a=0;a<s.length;++a)(r=s[a])instanceof Array?2!==r.length?o("Not a pair",a):("string"==typeof r[0]&&0!==r[0].length||o("Invalid key",a),"string"==typeof r[1]&&0!==r[1].length||o("Invalid value",a)):o("Not an array",a);var d=window.location.href;for(a=0;a<s.length;++a)r=s[a],2!==this.CountValues(s,r)&&o("Repeated",a),n=new URL((t||"")+r[1],d).href,-1!==e.indexOf(n)?o("Repeated URL",a):e.push(n)},App.Loader.CountValues=function(t,e){for(var s,i=0,o=0;o<t.length;++o)(s=t[o])[0]===e[0]&&(i+=1),s[1]===e[1]&&(i+=1);return i},App.Loader.Object2ListOfPairs=function(t){if(t instanceof Array)return t;var e,s=[];for(e in t)s.push([e,t[e]]);return s},App.Loader.CleanTasks=function(){for(;0<this.tasks.lst.length;)this.tasks.lst.pop();this.tasks.fnTicker=null},App.Loader.GetTasksSize=function(){return this.tasks.nr_bytes},App.Loader.GetTasksLength=function(){return this.tasks.nr_items_total},App.Loader.GetTasksTime=function(){return this.tasks.time},App.Sound={assets:null},App.Sound.LoadAssets=function(t,e){return App.Loader.LoadAudioList(t,e).then(t=>App.Sound.onAssetsLoaded(t))},App.Sound.onAssetsLoaded=function(t){for(var e in this.assets=t,this.assets)this.assets[e].id=e},App.Sound.Assert=function(t){const e=this.assets[t];return e.volume=0,e.onended=t=>t.target.volume=1,e.play()},App.Sound.Play=function(t){if(null===this.assets)return Promise.reject("App.Sound.Play >> No assets! "+t);var e=this.assets[t];return void 0===e?Promise.reject("App.Sound.Play >> No such sound: "+t):(0<e.currentTime&&e.currentTime<e.duration&&(e.volume=1,e.currentTime=0),e.play())},App.Storage={prefix:null},App.Storage.Init=function(t){this.prefix=t},App.Storage.Clear=function(){},App.Storage.RemoveItem=function(t){window.localStorage.removeItem(this.prefix+"_"+t)},App.Storage.SetItemJSON=function(t,e){window.localStorage.setItem(this.prefix+"_"+t,JSON.stringify(e))},App.Storage.GetItemJSON=function(t){return JSON.parse(window.localStorage.getItem(this.prefix+"_"+t))},App.Storage.PopulateItemJSON=function(t,e){var s=this.GetItemJSON(t);if(null===s)this.SetItemJSON(t,e);else for(var i in s)e.hasOwnProperty(i)&&(e[i]=s[i])},void 0===window.cordova?window.addEventListener("load",t=>Termos.Init()):document.addEventListener("deviceready",t=>{Termos.Init()}),1e3),FADE_IN=1e3,COLUMN_MOVE=500,CAPTION_TIME=3e3,RESET_TIME=1500,CELL_FONT_SIZE=.66,DEF_PRIBERAM="https://dicionario.priberam.org/",DEF_INFOPEDIA="https://www.infopedia.pt/dicionarios/lingua-portuguesa/";var Termos={DICTIONARY:"./dictionary/wordlist-FILTERED-5-final.txt",WORD_LENGTH:5,lst_found:null,lst_hints:null,lst_errors:null,restart:{timer:null,cnt:0},game_over:!0,player_died:!1};function eById(t){return document.getElementById(t)}function eByClass(t,e=document){return e.querySelector(t)}function eByClassAll(t,e=document){return e.querySelectorAll(t)}function eByTag(t,e=document){return e.getElementsByTagName(t)[0]}function eByTagAll(t,e=document){return e.getElementsByTagName(t)}function ApplyTimedClass(t,e,s=1e3,i=0){0<i?setTimeout(function(){ApplyTimedClass(t,e,s,0)},i):(t.classList.add(e),setTimeout(function(){t.classList.remove(e)},s))}function CloneArray(t){return t.slice(0)}function RemoveChildren(t){for(;t.children.length;)t.removeChild(t.firstChild)}function QuerySeachString(t,e=null,s=!1){t=new URL(window.location).searchParams.get(t);return null===t?t=e:s&&(t=parseInt(t,10)),t}Termos.Init=function(){App.Init(this.onResize.bind(this)),App.Storage.Init("Termos"),Termos.Sound.Init(),Termos.Hearts.Init(),Termos.Settings.Init(),Termos.Stats.Init(),Termos.ProgressMeter.Init(),Termos.Grid.Init(Termos.WORD_LENGTH),Termos.MakePlayZone(),Termos.onResize(App.GetWidth(),App.GetHeight()),eById("HomeBody").classList.remove("Init"),Termos.Sound.Load().then(),App.Loader.LoadText(Termos.DICTIONARY).then(t=>{Termos.Quizz.Init(t.split("\n"),this.WORD_LENGTH),t=null,Termos.AddEventListeners()})},Termos.Sound={},Termos.Sound.Init=function(){},Termos.Sound.Assert=function(t){App.Sound.Assert(t)},Termos.Sound.Play=function(t){return Termos.Settings.GetItem("sound")?App.Sound.Play(t):Promise.resolve(!1)},Termos.Sound.Load=function(){return App.Sound.LoadAssets({word_nk:"tim-kahn.mp3",word_ok:"fx-102.mp3",game_over:"prmlim-long.mp3",death:"ElectArcShrtCirc.mp3",known:"Quick-Fart.mp3"},"./sounds/")},Termos.onResize=function(t,e){var s=Termos.ProgressMeter.GetElement().offsetTop,i=(Termos.Grid.onResize(t,e,s),Termos.Grid.GetCellSize()),o=.04*t+"px";const r=.05*t+"px",n=.06*t+"px";var a=.08*t+"px",t=.12*t+"px",d=eById("HomeBody");eByTag("h1",d).style.fontSize=t,eByTag("h2",d).style.fontSize=a,eById("TableStats").style.fontSize=o;const l=eById("InfoMain");l.style.fontSize=o,Array.from(eByTagAll("h2",l)).forEach(t=>t.style.fontSize=r);d=e-l.offsetTop-eByClass(".PageFooter",eById("Info")).offsetHeight-s+"px",l.style.height=d,l.style.maxHeight=d,eByTag("h1",eById("GameOverStats")).style.fontSize=t,Array.from(eByTagAll("p",eById("GameOverStats"))).forEach(t=>t.style.fontSize=n),eById("GameOverStars").style.fontSize=t,eById("gos_time").style.fontSize=r,a=eById("ValidationRow").style;a.width=Termos.WORD_LENGTH*i+"px",a.height=i+"px",a.top=s+Termos.ProgressMeter.GetElement().offsetHeight+s+(Termos.WORD_LENGTH-1)*i+"px",a.left=Math.floor((Termos.Grid.GetElementWidth()-Termos.WORD_LENGTH*i)/2)+"px"},Termos.ShowPage=function(t){"Statistics"===t?this.Stats.UpdateInfo():"Play"!==t||this.Quizz.HasWordsSelection()||this.StartGame(),App.ShowPage(t)},Termos.StartGame=function(){for(this.Quizz.SelectWords(),this.Quizz.FindSolutions(),this.ResetErrorsList(),this.ResetSolutionsList(this.Quizz.CountRemainingSolutions()),this.ProgressMeter.Reset(this.Quizz.CountRemainingSolutions()),this.Grid.PopulateColumns(this.Quizz.GetSeedsList()),this.Hearts.Reset();this.Grid.ShuffleColumns(),this.Quizz.IsValidWord(this.Grid.GetCenterWord()););ApplyTimedClass(this.Grid.GetElement(),"Grid_FX_FadeIn",FADE_IN),this.lst_found=[],this.lst_hints=[],this.lst_errors=[],this.Stats.IncrementItem("games_start"),this.game_over=!1,this.player_died=!1,this.Settings.GetItem("special_help")&&this.UpdateSpecialHelp(),Array.from(eByTagAll("span",eById("GameOverStars"))).forEach(t=>t.classList.remove("GameOverStars_ON")),eByTag("h1",eById("GameOverStats")).innerHTML="&nbsp;",App.Clock.Start()},Termos.MakePlayZone=function(){const t=eByClass(".PageBody",eById("Play")),e=document.createElement("div");e.id="ValidationRow",t.appendChild(e),this.Grid.MakeElements(),t.appendChild(this.Grid.GetElement()),this.ProgressMeter.MakeElements(),t.appendChild(this.ProgressMeter.GetElement())},Termos.Reset=function(){if(!this.game_over){if(clearTimeout(this.restart.timer),this.restart.cnt+=1,1===this.restart.cnt)return void(this.restart.timer=setTimeout(t=>{Termos.restart.cnt=0},RESET_TIME));this.restart.cnt=0}ApplyTimedClass(this.Grid.GetElement(),"Grid_FX_FadeOut",FADE_OUT+FADE_IN),setTimeout(t=>Termos.StartGame(),FADE_OUT)},Termos.AddEventListeners=function(){this.Grid.AddEventListeners(),Array.from(eByClassAll(".ShareBtn")).forEach(t=>App.AddEventListener(t,"MOUSE||TOUCH",Termos.Share.onClickBtn.bind(Termos.Share))),Array.from(eByTagAll("input")).forEach(t=>App.AddEventListener(t,"change",Termos.Settings.onChangeValue.bind(Termos.Settings))),Array.from(eByTagAll("input")).forEach(t=>App.AddEventListener(t,"change",Termos.Settings.onChangeValue.bind(Termos.Settings))),Array.from(eByClassAll(".FooterButton")).forEach(t=>App.AddEventListener(t,"MOUSE||TOUCH",Termos.onClickButton.bind(Termos))),App.AddEventListener(eById("SolutionsList"),"MOUSE||TOUCH",Termos.onClickSolutionsList.bind(Termos)),App.AddEventListener(eById("import_seeds"),"MOUSE||TOUCH",Termos.Quizz.UserSeeds_Import.bind(Termos.Quizz)),App.AddEventListener(eById("export_seeds"),"MOUSE||TOUCH",Termos.Quizz.UserSeeds_Export.bind(Termos.Quizz)),App.AddEventListener(eById("cancel_seeds"),"MOUSE||TOUCH",Termos.Quizz.UserSeeds_Cancel.bind(Termos.Quizz))},Termos.onClickButton=function(t){t.preventDefault(),t.stopPropagation();var e=t.target.id.split("_")[1];"validate"===e?this.game_over||this.ValidateCenterWord():"restart"===e?this.Reset():"solutions"===e?this.ShowPage("Solutions"):"errors"===e?this.ShowPage("Errors"):"hint"===e?this.player_died||this.AddHint():"play"===e?this.ShowPage("Play"):"stats"===e?this.ShowPage("Statistics"):"settings"===e?this.ShowPage("Settings"):"info"===e?this.ShowPage("Info"):"delete"===e?(this.Stats.Clear(),this.ShowPage("Statistics")):"back"===e&&(void 0!==t.target.dataset.target?this.ShowPage(t.target.dataset.target):this.ShowPage("Home"))},Termos.onClickSolutionsList=function(t){t.preventDefault(),t.stopPropagation();const e=t.target;e.classList.contains("Solution")&&""!==e.dataset.word&&(this.ShowSolution(e.dataset.word),this.ShowWordDefinition(e.dataset.word))},Termos.ShowWordDefinition=function(t){var e=0===this.Settings.GetItem("def_word")?DEF_PRIBERAM:DEF_INFOPEDIA;window.open(e+t)},Termos.ClearSpecialHelp=function(){Array.from(eByClassAll(".GridCell")).forEach(t=>{t.classList.remove("GridCell_SomeWords"),t.classList.remove("GridCell_NoWords")})},Termos.UpdateSpecialHelp=function(){for(var t,e=0;e<Termos.WORD_LENGTH;++e)for(t=0;t<Termos.WORD_LENGTH;++t)0===this.Quizz.CountMatchingSolutions(this.Grid.GetCellLetter(e,t),e)?(this.Grid.RemoveClassNameCell(e,t,"GridCell_SomeWords"),this.Grid.AddClassNameCell(e,t,"GridCell_NoWords")):(this.Grid.RemoveClassNameCell(e,t,"GridCell_NoWords"),this.Grid.AddClassNameCell(e,t,"GridCell_SomeWords"))},Termos.onToggleSpecialHelp=function(){this.Settings.GetItem("special_help")?this.UpdateSpecialHelp():this.ClearSpecialHelp()},Termos.ResetErrorsList=function(){RemoveChildren(eById("ErrorsList"))},Termos.ResetSolutionsList=function(t){const e=eById("SolutionsList");var s,i;for(RemoveChildren(e),s=0;s<t;++s)(i=document.createElement("p")).classList.add("Solution"),i.dataset.word="",i.id="SomeSolution_"+s,i.innerHTML="&nbsp;",e.appendChild(i)},Termos.IsKnownWord=function(t){return-1!==this.lst_found.indexOf(t)||-1!==this.lst_hints.indexOf(t)},Termos.ValidateCenterWord=function(){var t=this.Grid.GetCenterWord();this.Quizz.IsSolutionWord(t)?(this.Sound.Play("word_ok"),this.AddFoundWord(t)):this.IsKnownWord(t)?(this.Sound.Play("known"),this.ShowKnownWord()):this.Quizz.IsValidWord(t)?alert("Special case...?"):this.ShowNotValidWord(t)?(this.Sound.Play("word_nk"),this.Hearts.IsActive()&&!this.Hearts.OneDown()&&this.PlayerDied()):this.Sound.Play("known")},Termos.ShowKnownWord=function(){Termos.ShowFX_Word_OK0()},Termos.ShowNotValidWord=function(t){var e;return this.ShowFX_Word_NK(),!this.lst_errors.includes(t)&&(this.Stats.IncrementItem("words_nk"),this.lst_errors.push(t),(e=document.createElement("p")).classList.add("Error"),e.innerHTML=t,eById("ErrorsList").appendChild(e),!0)},Termos.AddHint=function(){var t;this.player_died||null!==(t=this.Quizz.RemoveOneSolutionWord())&&(this.lst_hints.push(t),this.AddSolution(t,!1),this.ShowSolution(t))},Termos.ShowSolution=function(t){for(var e=0;e<this.WORD_LENGTH;++e)this.Grid.SetColumnPosition(e,this.Quizz.GetSeedLetterIndex(e,t[e]))},Termos.AddFoundWord=function(t){this.Quizz.IsSolutionWord(t)&&(this.lst_found.push(t),this.Quizz.RemoveSolutionWord(t),this.AddSolution(t,!0),this.ShowFX_Word_OK1(),this.Stats.IncrementItem("words_ok"))},Termos.ShowFX_Word_OK1=function(){var e=0;this.Grid.GetCenterRowCells().forEach(t=>{ApplyTimedClass(t,"Cell_FX_OK1",600,e+=150)})},Termos.ShowFX_Word_OK0=function(){this.Grid.GetCenterRowCells().forEach(t=>{ApplyTimedClass(t,"Cell_FX_OK0",1e3)})},Termos.ShowFX_Word_NK=function(){this.Grid.GetCenterRowCells().forEach(t=>{ApplyTimedClass(t,"Cell_FX_NK",2e3)})},Termos.AddSolution=function(t,e=!0){const s=eById("SomeSolution_"+this.Quizz.GetSolutionWordIndex(t));s.innerHTML=t,s.dataset.word=t,s.classList.add(e?"SolutionUser":"SolutionAuto"),this.ProgressMeter.Update(e),e||this.Stats.IncrementItem("hints"),this.Settings.GetItem("special_help")&&setTimeout(Termos.UpdateSpecialHelp.bind(Termos),1700),0===this.Quizz.CountRemainingSolutions()&&this.GameOver()},Termos.PlayerDied=function(){App.Clock.Stop(),this.game_over=!0,this.player_died=!0,this.Stats.IncrementItem("deaths")},Termos.GameOver=function(){App.Clock.Stop(),this.Stats.IncrementItem("games_end"),this.game_over=!0;const e=Math.round(100*this.lst_found.length/this.Quizz.GetSolutionsList().length);this.Stats.SetItem("performance",e),this.Sound.Assert("game_over"),setTimeout(t=>{Termos.ShowPage("GameOver"),Termos.ShowGameOverStats(e)},2500)},Termos.ShowGameOverStats=function(t){this.Sound.Play("game_over");for(var e=Math.round(t/20),s=(eByTag("h1",eById("GameOverStats")).innerHTML=["LOL","Boa","Boa","Muito bem","Fantástico","Top"][e]+"!",500),i=1;i<=e;){let e=i;setTimeout(t=>{eById("star_"+e).classList.add("GameOverStars_ON")},s),s+=200,i+=1}eById("txt_gos_found").innerHTML=this.lst_found?this.lst_found.length:"*",eById("txt_gos_all").innerHTML=this.Quizz.GetSolutionsList()?this.Quizz.GetSolutionsList().length:"*",eById("txt_gos_time").innerHTML=App.Clock.GetTime(),ApplyTimedClass(eById("GameOverStats"),"GameOverStats_FX",1e3)},Termos.ProgressMeter={element:null,idx:0},Termos.ProgressMeter.Init=function(){},Termos.ProgressMeter.MakeElements=function(){this.element=document.createElement("div"),this.element.id="ProgressMeter"},Termos.ProgressMeter.GetElement=function(){return this.element},Termos.ProgressMeter.Reset=function(t){RemoveChildren(this.element),this.idx=0;for(var e,s=100/t-.5;0<t--;)(e=document.createElement("span")).style.width=s+"%",this.element.appendChild(e)},Termos.ProgressMeter.Update=function(t){this.element.children[this.idx++].classList.add("Progress_"+(t?"OK1":"OK0"))},Termos.Settings={key:"settings",data:{special_help:!0,sound:!0,hearts:!0,cell_caption:!0,def_word:1}},Termos.Settings.Init=function(){var t,e;for(t in App.Storage.PopulateItemJSON(this.key,this.data),this.data)null!==(e=eById(t))?e.checked=this.data[t]:eById(t+"_"+this.data[t]).checked=!0;Termos.Hearts.Set(this.data.hearts)},Termos.Settings.Store=function(){App.Storage.SetItemJSON(this.key,this.data)},Termos.Settings.GetItem=function(t){return this.data[t]},Termos.Settings.SetItem=function(t,e){return this.data[t]=e,this.Store(),e},Termos.Settings.ToggleItem=function(t){return this.SetItem(t,!this.GetItem(t))},Termos.Settings.onChangeValue=function(t){var e=t.target.id;this.data.hasOwnProperty(e)?(this.SetItem(e,t.target.checked),"special_help"===e?Termos.onToggleSpecialHelp():"hearts"===e&&Termos.Hearts.Set(this.data.hearts)):this.SetItem(t.target.getAttribute("name"),parseInt(t.target.id.split("_").pop(),10))},Termos.Hearts={MAX:5,value:0,status:!0,element:null,value_element:null,image:null},Termos.Hearts.Init=function(){this.element=eById("btn_hearts"),this.value_element=eById("txt_hearts"),this.image=eByTag("img",this.element)},Termos.Hearts.Set=function(t){this.status=Boolean(t),this.element.style.display=this.status?"":"none",this.Update()},Termos.Hearts.Update=function(){RemoveChildren(this.value_element);for(var t="",e=1;e<=this.value;++e)t+="|";this.value_element.innerHTML=t},Termos.Hearts.Reset=function(){this.value=this.MAX,this.element.classList.remove("PlayerDied"),this.Update(),this.Teste(!1)},Termos.Hearts.IsActive=function(){return this.status},Termos.Hearts.OneDown=function(){return 0<this.value&&(--this.value,this.Update(),ApplyTimedClass(this.element,"OneDown",2e3),0===this.value&&(this.element.classList.add("PlayerDied"),Termos.Sound.Play("death"),setTimeout(t=>Termos.Hearts.Teste(!0),1e3))),0<this.value},Termos.Hearts.Teste=function(s){Array.from(eByClassAll(".GridCell")).forEach(t=>{var e;s?(e=Math.randomInt(-180,180),t.style.transform="rotate("+e+"deg)"):t.style.transform="rotate(0deg)"})},Termos.Stats={key:"stats",MAX:10,data:{games_start:0,games_end:0,words_ok:0,words_nk:0,hints:0,deaths:0,performance:[]}},Termos.Stats.Init=function(){App.Storage.PopulateItemJSON(this.key,this.data)},Termos.Stats.Store=function(){App.Storage.SetItemJSON(this.key,this.data)},Termos.Stats.Clear=function(){for(var t in this.data)"number"==typeof this.data[t]?this.data[t]=0:this.data[t]=[];this.Store()},Termos.Stats.GetItem=function(t){if(this.data.hasOwnProperty(t))return t=this.data[t],t instanceof Array?Math.round(t.reduce((t,e)=>t+e,0)/t.length):t},Termos.Stats.SetItem=function(t,e){this.data.hasOwnProperty(t)&&(this.data[t]instanceof Array?(this.data[t].push(e),this.data.length>this.MAX&&this.data.shift()):this.data[t]=e,this.Store())},Termos.Stats.IncrementItem=function(t){!this.data.hasOwnProperty(t)||this.data[t]instanceof Array||this.SetItem(t,this.GetItem(t)+1)},Termos.Stats.UpdateInfo=function(){var t=this.GetItem("games_start"),e=this.GetItem("games_end"),s=this.GetItem("words_ok"),i=this.GetItem("words_nk"),o=this.GetItem("hints"),r=this.GetItem("performance"),n=this.GetItem("deaths");eById("txt_stats_games_start").innerHTML=t,eById("txt_stats_games_end").innerHTML=e,eById("txt_stats_performance").innerHTML=0<e?r:"*",eById("txt_stats_hints").innerHTML=o,eById("txt_stats_words_ok").innerHTML=s,eById("txt_stats_words_nk").innerHTML=i,eById("txt_stats_success").innerHTML=0<s+i?Math.round(s/(s+i)*100):"*",eById("txt_stats_deaths").innerHTML=n},Termos.Grid={element:null,CELL_SIZE:0,WORD_LENGTH:0},Termos.Grid.Init=function(t){this.WORD_LENGTH=t},Termos.Grid.MakeElements=function(){var t,e,s,i;for(this.element=document.createElement("div"),this.element.id="Grid",t=0;t<this.WORD_LENGTH;++t){for((e=document.createElement("div")).classList.add("GridColumn"),e.id="GridColumn_"+t,e.dataset.position=t,e.dataset.idx=t,s=0;s<this.WORD_LENGTH;++s)(i=document.createElement("div")).classList.add("GridCell"),i.id=["Cell",t,s].join("_"),e.appendChild(i);this.element.appendChild(e)}return this.element},Termos.Grid.GetElement=function(){return this.element},Termos.Grid.onResize=function(t,e,s){this.element.style.top=2*s+Termos.ProgressMeter.GetElement().offsetHeight+"px",this.element.style.height=this.element.parentNode.offsetHeight-3*s-Termos.ProgressMeter.GetElement().offsetHeight+"px";var i=2*this.WORD_LENGTH-1,s=Math.floor((this.element.offsetWidth-2*s)/this.WORD_LENGTH),o=Math.floor(this.element.offsetHeight/i);this.CELL_SIZE=Math.min(s,o);const r=i*o;Array.from(this.element.children).forEach(e=>{e.style.width=this.CELL_SIZE+"px",e.style.height=r+"px",Array.from(e.children).forEach(t=>{t.style.width=this.CELL_SIZE+"px",t.style.height=this.CELL_SIZE+"px",t.style.fontSize=Math.floor(this.CELL_SIZE*CELL_FONT_SIZE)+"px"}),setTimeout(t=>Termos.Grid.SetColumnPosition(e.dataset.idx,e.dataset.position),1e3/60)})},Termos.Grid.GetElementWidth=function(){return this.element.offsetWidth},Termos.Grid.GetCenterWord=function(){var e=[];return Array.from(eByClassAll(".GridColumn")).forEach(t=>{e.push(Termos.Grid.GetCellLetter(t.dataset.idx,t.dataset.position))}),e.join("")},Termos.Grid.AddEventListeners=function(t){Array.from(eByClassAll(".GridCell")).forEach(t=>App.AddEventListener(t,"MOUSE||TOUCH",Termos.Grid.onClickCell.bind(Termos.Grid)))},Termos.Grid.SetColumnPosition=function(t,e){const s=eById("GridColumn_"+t);return s.style.top=(this.WORD_LENGTH-1-e)*this.CELL_SIZE+"px",parseInt(s.dataset.position,10)!==e&&(s.dataset.position=String(e),!0)},Termos.Grid.ShuffleColumns=function(){for(var t=0;t<this.WORD_LENGTH;++t)this.SetColumnPosition(t,Math.randomInt(0,this.WORD_LENGTH-1))},Termos.Grid.SetColumnWord=function(t,e){for(var s=0;s<this.WORD_LENGTH;++s)this.SetCellLetter(t,s,e[s])},Termos.Grid.PopulateColumns=function(t){for(var e=0;e<this.WORD_LENGTH;++e)this.SetColumnWord(e,t[e])},Termos.Grid.GetCellSize=function(){return this.CELL_SIZE},Termos.Grid.GetCellElement=function(t,e){return eById(["Cell",t,e].join("_"))},Termos.Grid.SetCellLetter=function(t,e,s){const i=this.GetCellElement(t,e);i.innerHTML=s,i.dataset.letter=s},Termos.Grid.GetCellLetter=function(t,e){return this.GetCellElement(t,e).dataset.letter},Termos.Grid.AddClassNameCell=function(t,e,s){this.GetCellElement(t,e).classList.add(s)},Termos.Grid.RemoveClassNameCell=function(t,e,s){this.GetCellElement(t,e).classList.remove(s)},Termos.Grid.onClickCell=function(t){t.preventDefault(),t.stopPropagation();var t=t.target.id.split("_"),e=parseInt(t[1],10),t=parseInt(t[2],10);this.AddCellCaption(e,t,Termos.Quizz.CountMatchingSolutions(this.GetCellLetter(e,t),e)),this.SetColumnPosition(e,t)&&Termos.IsKnownWord(this.GetCenterWord())&&setTimeout(Termos.ShowKnownWord,COLUMN_MOVE)},Termos.Grid.AddCellCaption=function(t,e,s){const i=this.GetCellElement(t,e);if(null===eByClass(".CellCaption",i)&&Termos.Settings.GetItem("cell_caption")&&(0!==s||!Termos.Settings.GetItem("special_help"))){const o=document.createElement("div");o.classList.add("CellCaption"),o.innerHTML=s,i.appendChild(o),setTimeout(()=>{i.removeChild(o)},CAPTION_TIME)}},Termos.Grid.GetCenterRowCells=function(){var e=[];return Array.from(eByClassAll(".GridColumn")).forEach(t=>{e.push(t.children[t.dataset.position])}),e},Termos.Quizz={data_words:null,NR_WORDS:0,WORD_LENGTH:0,lst_seeds:null,lst_solutions:null,lst_solutions_sorted:null,data_seeds:null},Termos.Quizz.Init=function(t,e){this.data_words=CloneArray(t),this.NR_WORDS=this.data_words.length,this.WORD_LENGTH=e,this.UserSeeds_Import(!0)},Termos.Quizz.CountRemainingSolutions=function(){return this.lst_solutions.length},Termos.Quizz.HasWordsSelection=function(){return null!==this.lst_seeds},Termos.Quizz.SelectWords=function(){return null!==this.data_seeds?this.SelectWords_DataSeeds():this.SelectWords_Random()},Termos.Quizz.UserSeeds_Export=function(){var t=this.ExportSeeds();null!==t?navigator.clipboard&&navigator.clipboard.writeText?(navigator.clipboard.writeText(t),alert("Código copiado para o clipboard.\nUsa Ctrl+V para partilhar.\n\n"+t)):window.prompt("Partilha o seguinte código:",t):alert("Inicia um desafio, para o poderes exportar")},Termos.Quizz.UserSeeds_Import=function(t){t instanceof Event?this.data_seeds=this.ImportSeeds(window.prompt("Código do desafio:")):this.data_seeds=!0===t?this.ImportSeeds(QuerySeachString("data","")):null,eById("data_seeds").innerHTML=null===this.data_seeds?"Não":"Sim",eById("cancel_seeds").style.display=null===this.data_seeds?"none":"",null!==this.data_seeds&&Termos.ShowPage("Play")},Termos.Quizz.UserSeeds_Cancel=function(){this.UserSeeds_Import(!1),Termos.StartGame()},Termos.Quizz.ImportSeeds=function(t){if("string"==typeof t&&0<t.length){t=LZString.decompressFromEncodedURIComponent(t);if(null!==t){t=t.split(":");if(t.length===this.WORD_LENGTH){var e=!0;if(t.forEach(t=>{t.length!==this.WORD_LENGTH&&(e=!1)}),e)return t}}}return null},Termos.Quizz.ExportSeeds=function(){return null!==this.lst_seeds?LZString.compressToEncodedURIComponent(this.lst_seeds.join(":")):null},Termos.Quizz.SelectWords_DataSeeds=function(){this.lst_seeds=CloneArray(this.data_seeds)},Termos.Quizz.SelectWords_Random=function(){var t=this.NR_WORDS-1,e=this.data_words[Math.randomInt(0,t)];this.lst_seeds=[];for(var s,i,o=0;i=e[o],(s=this.data_words[Math.randomInt(0,t)])!==e&&-1!==s.indexOf(i)&&(this.lst_seeds.push(s),o+=1),o<this.WORD_LENGTH;);return e},Termos.Quizz.FindSolutions=function(){this.lst_solutions=[];for(var t,e=0,s=[];e++<this.WORD_LENGTH;)s.push(0);for(e=Math.pow(this.WORD_LENGTH,this.WORD_LENGTH);null!==(t=this.FindWords_Next(s))&&-1===this.lst_solutions.indexOf(t)&&this.lst_solutions.push(t),0<--e;);this.lst_solutions_sorted=CloneArray(this.lst_solutions).sort()},Termos.Quizz.FindWords_Next=function(t){for(var e,s,i,o="",r=0;r<this.WORD_LENGTH;++r)o+=this.lst_seeds[r][t[r]];for(this.IsValidWord(o)||(o=null),r=this.WORD_LENGTH-1;e=t,s=r,i=this.WORD_LENGTH,e[s]+=1,e[s]===i&&(e[s]=0,1)&&0<=r;)--r;return o},Termos.Quizz.RemoveOneSolutionWord=function(){if(0===this.lst_solutions.length)return null;var t=Math.randomInt(0,this.lst_solutions.length-1);return this.lst_solutions.splice(t,1).pop()},Termos.Quizz.RemoveSolutionWord=function(t){t=this.lst_solutions.indexOf(t);-1!==t&&this.lst_solutions.splice(t,1)},Termos.Quizz.GetSolutionWordIndex=function(t){return this.lst_solutions_sorted.indexOf(t)},Termos.Quizz.IsSolutionWord=function(t){return-1!==this.lst_solutions.indexOf(t)},Termos.Quizz.IsValidWord=function(t){return-1!==this.data_words.indexOf(t)},Termos.Quizz.GetSolutionsList=function(){return this.lst_solutions_sorted},Termos.Quizz.GetSeedsList=function(){return this.lst_seeds},Termos.Quizz.CountMatchingSolutions=function(e,s){if(null===this.lst_solutions)return 0;var i=0;return this.lst_solutions.forEach(t=>{t[s]===e&&(i+=1)}),i},Termos.Quizz.GetSeedLetterIndex=function(t,e){return this.lst_seeds[t].indexOf(e)},Termos.Share={TERMOS_URL:"http://lado-de-la.nocturno.org/cenas-fish/termos-cruzados/",PARAMS:"menubar=no,toolbar=no,status=no,width=570,height=570",HASH_TAGS:"TermosCruzados,Jogo,Palavras,Portugal",SHARE_FACEBOOK:"http://www.facebook.com/sharer/sharer.phpu=",SHARE_TWITTER:"https://twitter.com/intent/tweet?url="},Termos.Share.Open=function(t){window.open(t,"ShareWindow",this.PARAMS)},Termos.Share.onClickBtn=function(t){t=t.target.id;"facebook"===t?this.Facebook():"twitter"===t&&this.Twitter()},Termos.Share.Twitter=function(){var t=encodeURIComponent("Joguei Termos Cruzados: "+(Termos.lst_found?Termos.lst_found.length:0)+"/"+(Termos.Quizz.GetSolutionsList()?Termos.Quizz.GetSolutionsList().length:0)+" em "+App.Clock.GetTime()+"."),t=this.TERMOS_URL+"&text="+t+"&hashtags="+this.HASH_TAGS;this.Open(this.SHARE_TWITTER+t)},Termos.Share.Facebook=function(){this.Open(this.SHARE_FACEBOOK+this.TERMOS_URL)},Math.randomInt=function(t,e){return Math.floor(Math.random()*(e-t+1))+t};