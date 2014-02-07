emmetApp.factory('DataService', ['TimeService', 'SymbolsService', function(TimeService, SymbolsService)
{
	var data = null;
	var hasData = false;
	
	var dataTimelineCollection = null;
	var dataTimelineAuthor = null;
	
	return {
		
		init: function(receivedData)
		{
			data = receivedData;
			this.processLetters();
			this.processPeople();
			
			//this.analyzeLetterDates();
			
			hasData = true;
		},
		
		analyzeLetterDates: function()
		{
			var dataDates = {};
			dataDates.lettersPerMonthYear = new Array();
			

			for (var letterId in data.accuratLetters)
			{
				var date = new Date(data.accuratLetters[letterId].date);
				
				var year = date.getFullYear();
				var month = date.getMonth();
				
				var id = "" + year + "-" + month;
				
				if (!dataDates.lettersPerMonthYear[id]) dataDates.lettersPerMonthYear[id] = 0;
				dataDates.lettersPerMonthYear[id] += 1;
			}
			
			console.log(dataDates.lettersPerMonthYear);
			
			
		},
		
		prepareDataMap: function(dataType)
		{
			var dataMap = {};
			dataMap.lettersByPlaceCatId = new Array();
			dataMap.lettersByStateSymbol = new Array();
			dataMap.lettersByCountry = new Array();
			
			for (var letterId in data.accuratLetters)
			{
				var place = data.accuratLetters[letterId].place;
				
				if (!dataMap.lettersByPlaceCatId[place.categoryId]) dataMap.lettersByPlaceCatId[place.categoryId] = new Array();
				dataMap.lettersByPlaceCatId[place.categoryId].push(place);
				
				if (place.hasState == 1)
				{
					if (!dataMap.lettersByStateSymbol[place.state]) dataMap.lettersByStateSymbol[place.state] = new Array();
					dataMap.lettersByStateSymbol[place.state].push(place);
				}
				
				if (place.hasCountry == 1)
				{
					if (!dataMap.lettersByCountry[place.country]) dataMap.lettersByCountry[place.country] = new Array();
					dataMap.lettersByCountry[place.country].push(place);
				}
				
			}
			
			
			
			/*var collection = null;
			if (dataType == SymbolsService.dataAccurat)
			{
				console.log("USING ACCURAT");
				collection = data.accuratLetters;
				
			}
			else
			{
				console.log("USING EMMET");
				collection = data.emmetLetters;
			}
			
			collection.forEach(function(letter)
			{
				//if (TimeService.isLetterInTimeline(letter))
				{
					if (!dataMap.lettersByPlace[letter.place.name]) dataMap.lettersByPlace[letter.place.name] = new Array();
					dataMap.lettersByPlace[letter.place.name].push(letter);
				}
			});
			
			for (var place in dataMap.lettersByPlace)
			{
				dataMap.lettersByPlaceArray.push(dataMap.lettersByPlace[place]);
			}
			
			dataMap.lettersByPlaceArray.sort(function(a,b)
					{return b.length - a.length;});*/
			
			
			
			
			return dataMap;
		},
		
		
		processPeople: function()
		{
			data.accuratPeople = this.processAccuratPeopleByEnumeration(data.peopleByAccuratId);
			data.emmetPeople = this.processEmmetPeopleByEnumeration(data.peopleByEmmetId);
		},
		
		processLetters: function()
		{
			var that = this;
			data.accuratLetters = new Array();
			data.emmetLetters = new Array();
			
			data.letters.forEach(function(letter)
			{
				data.accuratLetters.push(that.processAccuratLetter(letter));
				data.emmetLetters.push(that.processEmmetLetter(letter));
			});
		},
		
		processAccuratLetter: function(letter)
		{
			var accuratLetter = {};
			// varying fields
			accuratLetter.authorTotal = letter.accuratAuthorTotal;
			accuratLetter.authorTotalInYear = letter.accuratAuthorTotalInYear;
			accuratLetter.authors = this.processAccuratPeopleByIndex(letter.accuratAuthors);
			accuratLetter.chapterId = letter.accuratChapterId;
			accuratLetter.chapterName = letter.accuratChapterName;
			accuratLetter.date = letter.accuratDate;
			accuratLetter.id = letter.accuratId;
			accuratLetter.place = this.processAccuratPlace(letter.accuratPlace);
			accuratLetter.recipients = this.processAccuratPeopleByIndex(letter.accuratRecipients);
			// common fields
			accuratLetter.accuratPlaceAssignment = letter.accuratPlaceAssignment;
			accuratLetter.accuratYear = letter.accuratYear;
			accuratLetter.emmetAuthorString = letter.emmetAuthorString;
			accuratLetter.emmetContent = letter.emmetContent;
			accuratLetter.emmetPhysDesc = letter.emmetPhysDesc;
			accuratLetter.emmetPlaceString = letter.emmetPlaceString;
			accuratLetter.emmetRecipientString = letter.emmetRecipientString;
			accuratLetter.emmetSubChapter = letter.emmetSubChapter;
			accuratLetter.emmetText = letter.emmetText;
			
			return accuratLetter;
		},
		
		processEmmetLetter: function(letter)
		{
			var emmetLetter = {};
			// varying fields
			emmetLetter.authorTotal = letter.emmetAuthorTotal;
			emmetLetter.authorTotalInYear = letter.emmetAuthorTotalInYear;
			emmetLetter.authors = this.processEmmetPeopleByIndex(letter.emmetAuthors);
			emmetLetter.chapterId = letter.emmetChapterId;
			emmetLetter.chapterName = letter.emmetChapterName;
			emmetLetter.date = letter.emmetDate;
			emmetLetter.id = letter.emmetId;
			emmetLetter.place = this.processEmmetPlace(letter.emmetPlace);
			emmetLetter.recipients = this.processEmmetPeopleByIndex(letter.emmetRecipients);
			// common fields
			emmetLetter.accuratPlaceAssignment = letter.accuratPlaceAssignment;
			emmetLetter.accuratYear = letter.accuratYear;
			emmetLetter.emmetAuthorString = letter.emmetAuthorString;
			emmetLetter.emmetContent = letter.emmetContent;
			emmetLetter.emmetPhysDesc = letter.emmetPhysDesc;
			emmetLetter.emmetPlaceString = letter.emmetPlaceString;
			emmetLetter.emmetRecipientString = letter.emmetRecipientString;
			emmetLetter.emmetSubChapter = letter.emmetSubChapter;
			emmetLetter.emmetText = letter.emmetText;
			
			return emmetLetter;
		},
		
		processAccuratPeopleByIndex: function(accuratPeople)
		{
			var people = new Array();
			
			for (var i = 0; i < accuratPeople.length; i++)
			{
				var accuratPerson = accuratPeople[i];
				var person = {};
				
				person.id = accuratPerson.accuratId;
				person.name = accuratPerson.accuratName;
				person.isPerson = accuratPerson.isPerson;
				person.isCorporation = accuratPerson.isCorporation;
				
				people.push(person);
			}
			
			return people;
		},
		
		processEmmetPeopleByIndex: function(emmetPeople)
		{
			var people = new Array();
			
			for (var i = 0; i < emmetPeople.length; i++)
			{
				var emmetPerson = emmetPeople[i];
				var person = {};
				
				person.id = emmetPerson.emmetId;
				person.name = emmetPerson.emmetName;
				person.isPerson = emmetPerson.isPerson;
				person.isCorporation = emmetPerson.isCorporation;
				
				people.push(person);
			}
			
			return people;
		},
		
		processAccuratPeopleByEnumeration: function(accuratPeople)
		{
			var people = new Array();
			
			for (var accuratPersonId in accuratPeople)
			{
				var accuratPerson = accuratPeople[accuratPersonId];
				var person = {};
				
				person.id = accuratPerson.accuratId;
				person.name = accuratPerson.accuratName;
				person.isPerson = accuratPerson.isPerson;
				person.isCorporation = accuratPerson.isCorporation;
				
				people.push(person);
			}
			
			return people;
		},
		
		processEmmetPeopleByEnumeration: function(emmetPeople)
		{
			var people = new Array();
			
			for (var emmetPersonId in emmetPeople)
			{
				var emmetPerson = emmetPeople[emmetPersonId];
				var person = {};
				
				person.id = emmetPerson.emmetId;
				person.name = emmetPerson.emmetName;
				person.isPerson = emmetPerson.isPerson;
				person.isCorporation = emmetPerson.isCorporation;
				
				people.push(person);
			}
			
			return people;
		},
		
		processAccuratPlace: function(accuratPlace)
		{
			var place = {};
			
			place.id = accuratPlace.accuratId;
			place.name = accuratPlace.accuratName;
			place.categoryId = accuratPlace.accuratCategoryId;
			place.categoryName = accuratPlace.accratCategoryName;
			place.hasState = accuratPlace.accuratHasState;
			place.state = accuratPlace.accuratState;
			place.hasCountry = accuratPlace.accuratHasCountry;
			place.country = accuratPlace.accuratCountry;
			
			return place;
		},
		
		processEmmetPlace: function(emmetPlace)
		{
			var place = {};
			
			place.id = emmetPlace.emmetId;
			place.name = emmetPlace.emmetName;
			
			return place;
		},
		
		hasData: function()
		{
			return hasData;
		},
		
		getData: function(dataType, viewType, param)
		{
			if (!dataType && !viewType && !param)
			{
				return data;
			}
			else if (viewType == SymbolsService.dataTimelineCollection)
			{
				return this.prepareDataTimelineCollection(dataType);
			}
			else if (viewType == SymbolsService.dataTimelineAuthor)
			{
				return this.prepareDataPerson(dataType, param);
			}
		},
		
		prepareDataTimelineCollection: function(dataType)
		{
			var dataTimelineCollection =  {};
			dataTimelineCollection.lettersByYear = new Array();
			dataTimelineCollection.lettersCountByYear = new Array();
			dataTimelineCollection.authorCountByYear = new Array();
			dataTimelineCollection.authorCountTotal = new Array();
			
			var collection = null;
			if (dataType == SymbolsService.dataAccurat) collection = data.accuratLetters;
			else collection = data.emmetLetters;
			
			collection.forEach(function(letter)
		    {
		        if (TimeService.isLetterInTimeline(letter))
				{
					// raggrupamento lettere per anno
			        if (!dataTimelineCollection.lettersByYear[letter.accuratYear]) dataTimelineCollection.lettersByYear[letter.accuratYear] = new Array();
			        dataTimelineCollection.lettersByYear[letter.accuratYear].push(letter);
			
			        if (!dataTimelineCollection.lettersCountByYear[letter.accuratYear]) dataTimelineCollection.lettersCountByYear[letter.accuratYear] = 1;
			        else dataTimelineCollection.lettersCountByYear[letter.accuratYear] += 1;
			
			        // conteggio missive per autore mittente per anno
			        if (!dataTimelineCollection.authorCountByYear[letter.accuratYear]) dataTimelineCollection.authorCountByYear[letter.accuratYear] = new Array();
			        for (var i = 0; i < letter.authors.length; i ++)
			        {        
				        if (!dataTimelineCollection.authorCountByYear[letter.accuratYear][letter.authors[i]]) dataTimelineCollection.authorCountByYear[letter.accuratYear][letter.authors[i]] = 1;
				        else dataTimelineCollection.authorCountByYear[letter.accuratYear][letter.authors[i]] += 1;
			        }
			        
			        // conteggio missive per autore mittente su periodo complessivo
			        for (var i = 0; i < letter.authors.length; i ++)
			        {
			        	if (!dataTimelineCollection.authorCountTotal[letter.authors[i]]) dataTimelineCollection.authorCountTotal[letter.authors[i]] = 1;
			            else dataTimelineCollection.authorCountTotal[letter.authors[i]] += 1;
			        }
				}
		    });
			
			return dataTimelineCollection;
		},
		
		prepareDataPerson: function(dataType, personId)
		{
			var that = this;
			var dataTimelinePerson = {};
			dataTimelinePerson.lettersFromAuthor = new Array();
			dataTimelinePerson.lettersByRecipient = new Array();
			dataTimelinePerson.lettersByRecipientArray = [];
			
			var collection = null;
			if (dataType == SymbolsService.dataAccurat) collection = data.accuratLetters;
			else collection = data.emmetLetters;
			
			
			// estraggo le lettere scritte dall'autore
			collection.forEach(function(letter) 
			{
				if (TimeService.isLetterInTimeline(letter) && that.isPersonAuthorById(personId, letter)) dataTimelinePerson.lettersFromAuthor.push(letter);
			});
			
			// divido le lettere per destinatario
			dataTimelinePerson.lettersFromAuthor.forEach(function(letter)
		    {
		        var recipient = that.getComposedRecipientId(letter);
		        if (dataTimelinePerson.lettersByRecipient[recipient] == null || dataTimelinePerson.lettersByRecipient[recipient] == undefined) dataTimelinePerson.lettersByRecipient[recipient] = new Array();
		        dataTimelinePerson.lettersByRecipient[recipient].push(letter);
		    });
			
			// aggiungo a ciascun destinatario le lettere che ha mandato all'autore selezionato
			for (var composedRecipientId in dataTimelinePerson.lettersByRecipient)
			{
				var receivedLetters = this.getLettersFromComposedRecipientToAuthor(dataType, composedRecipientId, personId);
				for (var i = 0; i < receivedLetters.length; i++) dataTimelinePerson.lettersByRecipient[composedRecipientId].push(receivedLetters[i]);
			}
			
			// aggiungo gli autori che hanno scritto all'autore selezionato, ma a cui l'autore selezionato non ha mai scritto
			collection.forEach(function(letter) 
			{
				if (TimeService.isLetterInTimeline(letter))
				{
					var composedAuthorId = that.getComposedAuthorId(letter);
					// controllo se l'autore selezionato per la timeline compare tra i destinatari
					for (var j = 0; j < letter.recipients.length; j++)
					{
						if (letter.recipients[j].id == personId)
						{
							// la lettera è stata scritta all'autore selezionato per la timeline; la aggiungo a quelle da visualizzare
							if (dataTimelinePerson.lettersByRecipient[composedAuthorId] == null || dataTimelinePerson.lettersByRecipient[composedAuthorId] == undefined) dataTimelinePerson.lettersByRecipient[composedAuthorId] = new Array();
							dataTimelinePerson.lettersByRecipient[composedAuthorId].push(letter);
						}
					}
				}
			});
			
			// ordino le lettere di destinatario in ordine temporale
			for (var recipient in dataTimelinePerson.lettersByRecipient)
		    {
				dataTimelinePerson.lettersByRecipient[recipient].sort(function(a, b)
		        {
		            if (dataType == "accurat")
					{
		            	var aDate = new Date(a.date);
		            	var bDate = new Date(b.date);
		            	
		            	return aDate - bDate;
		            	
					}
					else return a.accuratYear - b.accuratYear;
		        });
		    }
			
			// ordino i destinatari sulla base della prima lettera scritta in ordine temporale; a parità di anno, ordine alfabetico
			for (var recipient in dataTimelinePerson.lettersByRecipient) dataTimelinePerson.lettersByRecipientArray.push(dataTimelinePerson.lettersByRecipient[recipient]);

			dataTimelinePerson.lettersByRecipientArray.sort(function(a, b)
		    {
		        // a,b sono vettori di lettere (rispettivamente gli insiemi di due recipient)
				if (a[0].accuratYear == b[0].accuratYear)
		        {
		            var x = 0;
		            var y = 0;
		            
					if (that.isPersonAuthorById(personId, a[0]) && that.isPersonAuthorById(personId, b[0]))
		            {
						x = a[0].recipients[0].name.toLowerCase();
			            y = b[0].recipients[0].name.toLowerCase();
		            }
		            else if (that.isPersonAuthorById(personId, a[0]) && that.isPersonRecipientById(personId, b[0]))
		            {
		            	x = a[0].recipients[0].name.toLowerCase();
			            y = b[0].authors[0].name.toLowerCase();
		            }
		            else if (that.isPersonRecipientById(personId, a[0]) && that.isPersonAuthorById(personId, b[0]))
		            {
		            	x = a[0].authors[0].name.toLowerCase();
			            y = b[0].recipients[0].name.toLowerCase();
		            }
		            else if (that.isPersonRecipientById(personId, a[0]) && that.isPersonRecipientById(personId, b[0]))
		            {
		            	x = a[0].authors[0].name.toLowerCase();
			            y = b[0].authors[0].name.toLowerCase();
		            }
		            
		            return x < y ? -1 : x > y ? 1 : 0;
		        }
		        else return a[0].accuratYear - b[0].accuratYear;
		    });
			
			return dataTimelinePerson;
		},
		
		isPersonAuthorById: function(personId, letter)
		{
			if (!personId) return false;
			if (!letter) return false;
			if (!letter.authors) return false;
			
			var found = false;
			for (var i = 0; i < letter.authors.length; i++)
			{
				if (personId == letter.authors[i].id)
				{
					found = true;
					break;
				}
			}
			return found;
		},
		
		isPersonRecipientById: function(personId, letter)
		{
			if (!personId) return false;
			if (!letter) return false;
			if (!letter.recipients) return false;
			
			var found = false;
			for (var i = 0; i < letter.recipients.length; i++)
			{
				if (personId == letter.recipients[i].id)
				{
					found = true;
					break;
				}
			}
			return found;
		},
		
		getComposedAuthorName: function(letter)
		{
			var composedAuthor = "";
		    if (letter.authors.length > 1)
		    {
		    	letter.authors.sort(function(a,b) 
		    	{
		    		var x = a.name.toLowerCase(), y = b.name.toLowerCase();
		            return x < y ? -1 : x > y ? 1 : 0;
		    	});
		    	
		    	for (var i = 0; i < letter.authors.length; i++) composedAuthor = composedAuthor + letter.authors[i].name + ";";
		    	composedAuthor = "{" + composedAuthor.substring(0, composedAuthor.length - 1) + "}";
		    }
		    else composedAuthor = letter.authors[0].name;
		    return composedAuthor;
		},
		
		getComposedRecipientName: function(letter)
		{
			var composedRecipient = "";
		    if (letter.recipients.length > 1)
		    {
		    	letter.recipients.sort(function(a,b) 
		    	{
		    		var x = a.name.toLowerCase(), y = b.name.toLowerCase();
		            return x < y ? -1 : x > y ? 1 : 0;
		    	});
		    	
		    	for (var i = 0; i < letter.recipients.length; i++) composedRecipient = composedRecipient + letter.recipients[i].name + ";";
		    	composedRecipient = "{" + composedRecipient.substring(0, composedRecipient.length - 1) + "}";
		    }
		    else composedRecipient = letter.recipients[0].name;
		    return composedRecipient;
		},
		
		getComposedAuthorNameToken: function(letter, i)
		{
			var composedAuthor = "";
		    if (letter.authors.length > 1 && i < letter.authors.length)
		    {
		    	composedAuthor = letter.authors[i].name + ";";
		    	if (i == 0) composedAuthor = "{" + composedAuthor;
		    	if (i == letter.authors.length - 1) composedAuthor = composedAuthor.substring(0, composedAuthor.length - 1) + "}";
		    }
		    else composedAuthor = letter.authors[0].name;
		    return composedAuthor;
		},
		
		getComposedRecipientNameToken: function(letter, i)
		{
			var composedRecipient = "";
		    if (letter.recipients.length > 1 && i < letter.recipients.length)
		    {
		    	composedRecipient = letter.recipients[i].name + ";";
		    	if (i == 0) composedRecipient = "{" + composedRecipient;
		    	if (i == letter.recipients.length - 1) composedRecipient = composedRecipient.substring(0, composedRecipient.length - 1) + "}";
		    }
		    else composedRecipient = letter.recipients[0].name;
		    return composedRecipient;
		},
		
		getComposedAuthorClass: function(letter)
		{
			var composedClass = "";
		    if (letter.authors.length > 1)
		    {
		    	for (var i = 0; i < letter.authors.length; i++) composedClass = composedClass + "p" + letter.authors[i].id + " ";
		    	composedClass = composedClass.substring(0, composedClass.length - 1);
		    }
		    else composedClass = "p" + letter.authors[0].id;
		    return composedClass;
		},
		
		getComposedRecipientClass: function(letter)
		{
			var composedClass = "";
		    if (letter.recipients.length > 1)
		    {
		    	for (var i = 0; i < letter.recipients.length; i++) composedClass = composedClass + "p" + letter.recipients[i].id + " ";
		    	composedClass = composedClass.substring(0, composedClass.length - 1);
		    }
		    else composedClass = "p" + letter.recipients[0].id;
		    return composedClass;
		},
		
		getComposedAuthorId: function(letter)
		{
			var composedAuthor = "";
		    if (letter.authors.length > 1)
		    {
		    	letter.authors.sort(function(a,b) 
		    	{
		    		var x = a.name.toLowerCase(), y = b.name.toLowerCase();
		            return x < y ? -1 : x > y ? 1 : 0;
		    	});
		    	
		    	for (var i = 0; i < letter.authors.length; i++) composedAuthor = composedAuthor + letter.authors[i].id + ";";
		    	composedAuthor = composedAuthor.substring(0, composedAuthor.length - 1);
		    }
		    else composedAuthor = letter.authors[0].id;
		    return composedAuthor;
		},
		
		getComposedRecipientId: function(letter)
		{
			var composedRecipient = "";
		    if (letter.recipients.length > 1)
		    {
		    	letter.recipients.sort(function(a,b) 
		    	{
		    		var x = a.name.toLowerCase(), y = b.name.toLowerCase();
		            return x < y ? -1 : x > y ? 1 : 0;
		    	});
		    	
		    	for (var i = 0; i < letter.recipients.length; i++) composedRecipient = composedRecipient + letter.recipients[i].id + ";";
		    	composedRecipient = composedRecipient.substring(0, composedRecipient.length - 1);
		    }
		    else composedRecipient = letter.recipients[0].id;
		    return composedRecipient;
		},
		
		isPersonAuthorByComposedId: function(personComposedId, letter)
		{
			if (!personComposedId) return false;
			if (!letter) return false;
			if (!letter.authors) return false;
			
			var found = false;
			if (personComposedId == this.getComposedAuthorId(letter)) found = true;
			return found;
		},
		
		isPersonRecipientByComposedId: function(personComposedId, letter)
		{
			if (!personComposedId) return false;
			if (!letter) return false;
			if (!letter.recipients) return false;
			
			var found = false;
			if (personComposedId == this.getComposedRecipientId(letter)) found = true;
			return found;
		},
		
		getLettersFromComposedRecipientToAuthor: function(dataType, composedRecipientId, authorId)
		{
			var that = this;
			var ret = [];
			if (!composedRecipientId) return ret;
			if (!authorId) return ret;
			
			var collection = null;
			if (dataType == SymbolsService.dataAccurat) collection = data.accuratLetters;
			else collection = data.emmetLetters;
			
			collection.forEach(function(letter)
			{
				if (TimeService.isLetterInTimeline(letter) && that.isPersonAuthorByComposedId(composedRecipientId, letter) && that.isPersonRecipientById(authorId, letter))
				{
					ret.push(letter);
				}
			});
			return ret;
		},
		
		sortLetters: function(lettersByYear, sortType)
		{
			if (sortType == SymbolsService.orderAuthorYear)
		    {
		        lettersByYear.forEach(function(year)
		        {
		            year.sort(function(a,b)
		            {
		                if (b.authorTotalInYear === a.authorTotalInYear)
		                {
		                    var x = a.authors[0].name.toLowerCase(), y = b.authors[0].name.toLowerCase();
		                    return x < y ? -1 : x > y ? 1 : 0;
		                }
		                else return b.authorTotalInYear - a.authorTotalInYear;
		            });
		        });
		    }
		    else if (sortType == SymbolsService.orderAuthorTotal)
		    {
		    	lettersByYear.forEach(function(year)
		        {
		            year.sort(function(a,b)
		            {
		                if (b.authorTotal === a.authorTotal)
		                {
		                    var x = a.authors[0].name.toLowerCase(), y = b.authors[0].name.toLowerCase();
		                    return x < y ? -1 : x > y ? 1 : 0;
		                }
		                else return b.authorTotal - a.authorTotal;
		            });
		        });
		    }
		    else if (sortType == SymbolsService.orderTopic)
		    {
		    	lettersByYear.forEach(function(year)
		        {
		            year.sort(function(a,b)
		            {
		                if (b.chapterName === a.chapterName)
		                {
		                    var x = a.authors[0].name.toLowerCase(), y = b.authors[0].name.toLowerCase();
		                    return x < y ? -1 : x > y ? 1 : 0;
		                }
		                else
		                {
		                    var x = a.chapterName.toLowerCase(), y = b.chapterName.toLowerCase();
		                    return x < y ? -1 : x > y ? 1 : 0;
		                }
		            });
		        });
		    }
			
			return lettersByYear;
		},
		
		getPersonById: function(dataType, personId)
		{
			var person = {};
			if (dataType == SymbolsService.dataAccurat)
			{
				var accuratPerson = data.peopleByAccuratId[personId];
				
				person.id = accuratPerson.accuratId;
				person.name = accuratPerson.accuratName;
				person.isPerson = accuratPerson.isPerson;
				person.isCorporation = accuratPerson.isCorporation;
			}
			else
			{
				var emmetPerson = data.peopleByEmmetId[personId];
				
				person.id = emmetPerson.emmetId;
				person.name = emmetPerson.emmetName;
				person.isPerson = emmetPerson.isPerson;
				person.isCorporation = emmetPerson.isCorporation;
			}
			
			return person;
		}
	};
}]);