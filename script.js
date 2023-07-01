
{
    "use strict";
	
/* ÜBEN VON SELEKTOREN */

	// get HTML element by type of element
	const article = document.getElementsByTagName("article");
	// console.log(article);
	// get HTML element by ID
	const bestell_link = document.getElementById("bestell_link");
	// console.log(bestell_link);
	// get HTML element by CSS Selektor (select all elements fitting the criteria)
	const nav_links = document.querySelectorAll("nav a");
	// console.log(nav_links);
	const descr_links = document.querySelectorAll("#uebersicht td a");
	// console.log(descr_links);
	// get HTML element by CSS Selektor (select first element fitting the criteria)
	const filmtipps_header = document.querySelector("#filmtipps");
	// console.log(filmtipps_header);
	const zurueck_link = document.getElementById("zurueck");
	const film_buttons = document.getElementsByName("film[]");
	// console.log(film_buttons);
	const h1 = document.getElementsByTagName("h1");
	// console.log(h1);
	const left_box = document.getElementsByClassName("left-box");
	// console.log(left_box);


/* INTERAKTIVE ELEMENTE */

	// Hover over filmposter -> increase size
	const filmposters = document.getElementsByClassName("filmposter");
	for (let i = 0; i < filmposters.length; i++) {
		let currentposter = filmposters[i];
		// console.log(currentposter);
		// man kann nicht direkt den Funktionsaufruf in addEventListener schreiben, man muss eine FunktionsDEKLARATION reinschreiben
		currentposter.addEventListener("mousemove", function(){
		increaseImgSize(currentposter);
		});

		currentposter.addEventListener("mouseout", function(){
			decreaseImgSize(currentposter);
		});
		// change Filmposter to other picture
		if(currentposter.src.match("pics/My_Beautiful_Laundrette.jpg")) {
			currentposter.addEventListener("click", function() {
				// currentposter.scr = "pics/My_Beautiful_Laundrette2.jpg";
				// obiger Aufruf funktioniert nicht
				currentposter.setAttribute('src', 'pics/My_Beautiful_Laundrette2.jpg');
				let answer = document.createElement("p");
				let text = document.createTextNode("Sie sehen jetzt das zweite Filmposter, das es zu diesem Film gibt");
				// answer.style.font = "italic bold 0.7rem";
				// Die Zusammenfassung dieser Attribute zu font funktioniert nicht
				answer.style.fontSize = "0.7rem";
				answer.style.fontStyle = "italic";
				answer.style.fontWeight = "bold";
				answer.appendChild(text); 
				// Der obige Text soll nur einmal hinzugefügt werden, nicht bei jedem Klick
				if(currentposter.parentElement.lastChild.nodeName == "P"){
					currentposter.parentElement.lastElementChild.remove();
				}
				currentposter.parentElement.append(answer);
			});
		}
	}


	// über Checkboxes fahren -> Farbe ändern
	const checkboxes = document.querySelectorAll("input[name=\"film[]\"]");
	for (let i = 0; i < checkboxes.length; i++) {
		let onebox = checkboxes[i].previousElementSibling;
		// console.log(onebox);
		onebox.addEventListener("mousemove", function() {
			changeCheckboxColor(onebox, "active");
		});
		onebox.addEventListener("mouseout", function() {
			changeCheckboxColor(onebox, "inactive");
		});		
	}



/* FUNKTIONEN FÜR INTERAKTIVE ELEMENTE */

	function increaseImgSize(myimage) {
		myimage.style.height = "16rem";
	}

	function decreaseImgSize(myimage) {
		myimage.style.height = "14rem";
	}

	function changeCheckboxColor(item, status) {
		if(status==="active"){
			item.style.color = "rgba(245, 40, 145, 1)";
		} else if(status==="inactive"){
			item.style.color = "rgba(0, 0, 0, 1)";
		}
	}

/*	
	// Problem: löscht bereits eingegebene Daten (und lenkt auf Hauptseite um)
	function changeColor() {
		const textarea = document.getElementById("comment");
		textarea.style.background = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6);
		console.log("changed color");
	}
*/




/* FORMULARPRÜFUNG */


	const form = document.forms[0];
	if(typeof form !== "undefined") {
		form.setAttribute("validate",true);
		// console.log(form.attributes);

		// Bei Verlassen des Feldes schon prüfen
		// propagation umkehren
		form.addEventListener("blur",
			e => {
				let valid = e.target.validity.valid;
				console.log(e.target, e.target.validity.valid);
					if(!valid){
						if(!(e.target.type === "submit" || e.target.type == "reset")) {
							 // Input nicht valid -> drucke Fehler
							const message = showMessage(e.target, errorMessage(e.target));
		                            		// console.log(message);
						}
						else {
							// console.log("field input is invalid, but field type is submit/reset button");
		                		}                
		                        }
					else {
						// Feld ist valid, lösche Fehlermeldung falls vorhanden
						deleteMessage(e.target);
					}
				}, true);
	}

	// Handling des Submit Events
	const submit = document.querySelector("[type=submit]");
	if(submit !== null) {
		submit.addEventListener("click",
		                        e => {
						e.preventDefault();
						console.log(`Eingegebene Daten:
						Vorname: 
						 ${document.querySelector("[id='fn']").value}
						Email:
						 ${document.querySelector("[id='email']").value}
						Filme:
						Female Pleasure: ${document.querySelector("[id='femalepl']").checked}
						Jeanne Dielman: ${document.querySelector("[id='jeanned']").checked}
						My Beautiful Laundrette:  ${document.querySelector("[id='mybeautiful']").checked}
						Toni Erdmann: ${document.querySelector("[id='tonie']").checked}
						Sprache:
						 ${document.querySelector("[id='lang']").value}
						Grüße:
						 ${document.querySelector("[id='comment']").value}
						`);
						// if valid, submit
						if(isFormValid(form)) {
							// Formulardaten senden
							const formDataJSON = formToJSON(form);
							console.log(formDataJSON);
							// const request = new XMLHttpRequest();
							// request.open("POST", "submitform.php");
							// request.send(formData);							
							console.log("submit");
							form.submit();
						}
					},
		                        false);
	}

	// Handling des Reset Events
	const reset = document.querySelector("[type=reset]");
	if(reset !== null) {
	reset.addEventListener("click",
                                e => {location.reload();},
                                false);
	}


/* FUNKTIONEN FÜR FORMULARPRÜFUNG */

	// Einbauen der Fehlermeldung in die Seite
	function showMessage(field, errorMessage){
		deleteMessage(field);
		let message = document.createElement("p");
		message.className = field.id;
		// Get the field label instead of Legend
		var labels = document.getElementsByTagName('LABEL');
		for (var i = 0; i < labels.length; i++) {
		    if (labels[i].htmlFor != '') {
			 var elem = document.getElementById(labels[i].htmlFor);
			 if (elem)
			    elem.label = labels[i];         
		    }
		}
		let text = document.createTextNode(`Im Feld ${document.getElementById(field.id).label.innerHTML} : ${errorMessage}`);
		let bold = document.createElement('strong');
		bold.appendChild(text);
		message.appendChild(bold);
		form.appendChild(message);
		return message;
	}

	// Löschen von vorherigen Fehlermeldungen, falls für das gleiche Feld eine neue auftritt
	// und wenn Fehler korrigiert wurde
	function deleteMessage(newErrorField){
		// console.log(`new error field: ${newErrorField.id}`);
		// iterate through form children
		let iterator = form.childNodes;
		for(i=iterator.length -1; i > -1 ; i--) {
			if(iterator[i].nodeName == "P") {
				// console.log(`child element is P: ${iterator[i]}`);
				const oldErrorClass = iterator[i].className; // ID of old error field
				if(oldErrorClass == newErrorField.id) {
					// console.log("same error field, delete message");
					iterator[i].remove();
				}
			}
		}
	}


	// spezifische Fehlermeldung bei fehlerhaften Formulareingaben
	function errorMessage(field){
		if(field.validity.valueMissing) {
			return "Bitte ausfüllen! Das Feld ist ein Pflichtfeld";
		}
		else if(field.validity.tooShort) {
			return "Zu wenig Zeichen! Bitte mehr als 1";
		}
		else if(field.validity.patternMismatch) {
			return "Input entspricht nicht dem erwarteten Pattern! Bitte nur Buchstaben (ohne Umlaute) und Länge zwischen 2 und 25";
		}
		else if(field.validity.typeMismatch) {
			return "Input entspricht nicht dem erwarteten Typ! Bitte Emailadresse eingeben";
		}
		else if(field.validity.valid) {
			return "valid";
		}
	}


	// Prüfen ob Formular valide
	function isFormValid(form) {
	let allFields = form.elements;
	for (var i = 0; i < allFields.length; i++) {
		// console.log(`${allFields[i]} is: ${allFields[i].validity.valid}`);
		let valid = errorMessage(allFields[i]);
		if(valid !== "valid") {
			console.log("one field invalid");
			return 0;
		}
	}
	return 1;
	}


	// Umwandeln Formularwerte in JSON 
	function formToJSON(form) {
		let formData = new FormData(form);
		// append the Text Area content
		formData.append("comment", document.getElementById("comment").value);
		console.log(formData);
		// convert form data to Object
		const formDataObj = Object.fromEntries(formData.entries());
		// the newly created Object removes duplicates -> only keeps the last checkbox with the name "film[]"
		// CORRECT THE CHECKBOXES
		formDataObj["film[]"] = {};
		let counter=-1;
		for (const pair of formData.entries()) {
			const key = pair[0];
			const value = pair[1];
			if(key == "film[]") {
				counter = counter +1;
				// console.log(`${key}, ${value}`);
				formDataObj["film[]"][counter] = value;
			}
		}
		console.log(formDataObj);
		const formDataJSON = JSON.stringify(formDataObj);
		return(formDataJSON);
	}


}

