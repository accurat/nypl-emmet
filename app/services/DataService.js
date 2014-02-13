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
			this.processPeople();
			this.processPlaces();
			this.processLetters();
			this.processChapters();
			hasData = true;
		},
		
		processPeople: function()
		{
			data.accuratPeople = this.processAccuratPeopleByEnumeration(data.peopleByAccuratId);
			data.emmetPeople = this.processEmmetPeopleByEnumeration(data.peopleByEmmetId);
		},
		
		processPlaces: function()
		{
			data.accuratPlaces = this.processAccuratPlacesByEnumeration(data.placeByAccuratId);
			data.emmetPlaces = this.processEmmetPlacesByEnumeration(data.placeByEmmetId);
		},
		
		processChapters: function()
		{
			data.accuratChapters = this.processAccuratChaptersByEnumeration(data.chapterByAccuratId);
			data.emmetChapters = this.processEmmetChaptersByEnumeration(data.chapterByEmmetId);
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
			var chapter = this.getChapterById(SymbolsService.dataAccurat, letter.aChapId);
			
			var accuratLetter = {};
			// varying fields
			accuratLetter.authorTotal = letter.aAutTot;
			accuratLetter.authorTotalInYear = letter.aAutTotInYear;
			accuratLetter.authors = this.processAccuratPeopleByIndex(letter.aAut);
			accuratLetter.date = letter.aDate;
			accuratLetter.id = letter.aId;
			accuratLetter.place = this.getPlaceById(SymbolsService.dataAccurat, letter.aPl);
			accuratLetter.recipients = this.processAccuratPeopleByIndex(letter.aRec);
			accuratLetter.chapterId = chapter.id;
			accuratLetter.chapterName = chapter.name;
			// common fields
			accuratLetter.accuratYear = letter.aYear;
			accuratLetter.accuratChapter = chapter;
			accuratLetter.emmetAuthorString = letter.eAutSt;
			accuratLetter.emmetContent = letter.eContent;
			accuratLetter.emmetPhysDesc = letter.ePhysDesc;
			accuratLetter.emmetRecipientString = letter.eRecSt;
			accuratLetter.emmetChapter = this.getChapterById(SymbolsService.dataEmmet, letter.eChapId);
			accuratLetter.emmetText = letter.eText;
			
			return accuratLetter;
		},
		
		processEmmetLetter: function(letter)
		{
			var chapter = this.getChapterById(SymbolsService.dataEmmet, letter.eChapId);
			
			var emmetLetter = {};
			// varying fields
			emmetLetter.authorTotal = letter.eAutTot;
			emmetLetter.authorTotalInYear = letter.eAutTotInYear;
			emmetLetter.authors = this.processEmmetPeopleByIndex(letter.eAut);
			emmetLetter.date = letter.eDate;
			emmetLetter.id = letter.eId;
			emmetLetter.place = this.getPlaceById(SymbolsService.dataEmmet, letter.ePl);
			emmetLetter.recipients = this.processEmmetPeopleByIndex(letter.eRec);
			emmetLetter.chapterId = chapter.id;
			emmetLetter.chapterName = chapter.name;
			// common fields
			emmetLetter.accuratYear = letter.aYear;
			emmetLetter.accuratChapter = this.getChapterById(SymbolsService.dataAccurat, letter.aChapId);
			emmetLetter.emmetAuthorString = letter.eAutSt;
			emmetLetter.emmetContent = letter.eContent;
			emmetLetter.emmetPhysDesc = letter.ePhysDesc;
			emmetLetter.emmetRecipientString = letter.eRecSt;
			emmetLetter.emmetChapter = chapter;
			emmetLetter.emmetText = letter.eText;
			
			return emmetLetter;
		},
		
		processAccuratPeopleByIndex: function(accuratPeople)
		{
			var people = new Array();
			for (var i = 0; i < accuratPeople.length; i++) people.push(this.getPersonById(SymbolsService.dataAccurat, accuratPeople[i]));
			
			return people;
		},
		
		processEmmetPeopleByIndex: function(emmetPeople)
		{
			var people = new Array();
			for (var i = 0; i < emmetPeople.length; i++) people.push(this.getPersonById(SymbolsService.dataEmmet, emmetPeople[i]));
			
			return people;
		},
		
		processAccuratPeopleByEnumeration: function(accuratPeople)
		{
			var people = new Array();
			
			for (var accuratPersonId in accuratPeople)
			{
				var accuratPerson = accuratPeople[accuratPersonId];
				var person = {};
				
				person.id = accuratPerson.aId;
				person.name = accuratPerson.aName;
				
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
				
				person.id = emmetPerson.eId;
				person.name = emmetPerson.eName;
				
				people.push(person);
			}
			
			return people;
		},
		
		processAccuratPlacesByEnumeration: function(accuratPlaces)
		{
			var places = new Array();
			
			for (var accuratPlaceId in accuratPlaces)
			{
				var accuratPlace = accuratPlaces[accuratPlaceId];
				var place = {};
				
				place.id = accuratPlace.aId;
				place.name = accuratPlace.aName;
				place.country = accuratPlace.aCountry;
				place.state = accuratPlace.aState;
				
				places.push(place);
			}
			
			return places;
		},
		
		processEmmetPlacesByEnumeration: function(emmetPlaces)
		{
			var places = new Array();
			
			for (var emmetPlaceId in emmetPlaces)
			{
				var emmetPlace = emmetPlaces[emmetPlaceId];
				var place = {};
				
				place.id = emmetPlace.eId;
				place.name = emmetPlace.eName;
				
				places.push(place);
			}
			
			return places;
		},
		
		processAccuratChaptersByEnumeration: function(accuratChapters)
		{
			var chapters = new Array();
			
			for (var accuratChapterId in accuratChapters)
			{
				var accuratChapter = accuratChapters[accuratChapterId];
				var chapter = {};
				
				chapter.id = accuratChapter.aId;
				chapter.name = accuratChapter.aName;
				
				chapters.push(chapter);
			}
			
			return chapters;
		},
		
		processEmmetChaptersByEnumeration: function(emmetChapters)
		{
			var chapters = new Array();
			
			for (var emmetChapterId in emmetChapters)
			{
				var emmetChapter = emmetChapters[emmetChapterId];
				var chapter = {};
				
				chapter.id = emmetChapter.eId;
				chapter.name = emmetChapter.eName;
				
				chapters.push(chapter);
			}
			
			return chapters;
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
			var dataTimelinePerson = [];
			
			var lettersFromAuthor = new Array();
			var lettersByRecipient = new Array();
			
			
			
			var collection = null;
			if (dataType == SymbolsService.dataAccurat) collection = data.accuratLetters;
			else collection = data.emmetLetters;
			
			
			// estraggo le lettere scritte dall'autore
			collection.forEach(function(letter) 
			{
				if (TimeService.isLetterInTimeline(letter) && that.isPersonAuthorById(personId, letter)) lettersFromAuthor.push(letter);
			});
			
			// divido le lettere per destinatario
			lettersFromAuthor.forEach(function(letter)
		    {
		        var recipient = that.getComposedRecipientId(letter);
		        if (lettersByRecipient[recipient] == null || lettersByRecipient[recipient] == undefined) lettersByRecipient[recipient] = new Array();
		        lettersByRecipient[recipient].push(letter);
		    });
			
			// aggiungo a ciascun destinatario le lettere che ha mandato all'autore selezionato
			for (var composedRecipientId in lettersByRecipient)
			{
				var receivedLetters = this.getLettersFromComposedRecipientToAuthor(dataType, composedRecipientId, personId);
				for (var i = 0; i < receivedLetters.length; i++)
				{
					if (!that.isLetterInCollection(lettersByRecipient[composedRecipientId], receivedLetters[i]))
					{
						lettersByRecipient[composedRecipientId].push(receivedLetters[i]);
					}
				}
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
							// lettera scritta all'autore selezionato per la timeline; la aggiungo a quelle da visualizzare
							if (lettersByRecipient[composedAuthorId] == null || lettersByRecipient[composedAuthorId] == undefined) lettersByRecipient[composedAuthorId] = new Array();
							
							if (!that.isLetterInCollection(lettersByRecipient[composedAuthorId], letter))
							{
								lettersByRecipient[composedAuthorId].push(letter);
							}
						}
					}
				}
			});
			
			// ordino le lettere di destinatario in ordine temporale
			for (var recipient in lettersByRecipient)
		    {
				lettersByRecipient[recipient].sort(function(a, b)
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
			
			// ordino i destinatari sulla base della prima lettera scritta in ordine temporale; a parit� di anno, ordine alfabetico
			for (var recipient in lettersByRecipient) dataTimelinePerson.push(lettersByRecipient[recipient]);

			dataTimelinePerson.sort(function(a, b)
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
		
		isLetterInCollection: function(collection, letter)
		{
			var found = false;
			for (var collectionElement in collection)
			{
				if (collection[collectionElement].id == letter.id)
				{
					found = true;
					break;
				}
			}
			
			return found;
			
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
				
				person.id = accuratPerson.aId;
				person.name = accuratPerson.aName;
				//person.isPerson = accuratPerson.isPerson;
				//person.isCorporation = accuratPerson.isCorporation;
			}
			else
			{
				var emmetPerson = data.peopleByEmmetId[personId];
				
				person.id = emmetPerson.eId;
				person.name = emmetPerson.eName;
				//person.isPerson = emmetPerson.isPerson;
				//person.isCorporation = emmetPerson.isCorporation;
			}
			
			return person;
		},
		
		getPlaceById: function(dataType, placeId)
		{
			var place = {};
			if (dataType == SymbolsService.dataAccurat)
			{
				var accuratPlace = data.placeByAccuratId[placeId];
				
				place.id = accuratPlace.aId;
				place.name = accuratPlace.aName;
				place.country = accuratPlace.aCountry;
				place.state = accuratPlace.aState;
			}
			else
			{
				var emmetPlace = data.placeByEmmetId[placeId];
				
				place.id = emmetPlace.emmetId;
				place.name = emmetPlace.emmetName;
			}
			
			return place;
		},
		
		getLetterById: function(dataType, letterId)
		{
			var collection = null;
			if (dataType == SymbolsService.dataAccurat) collection = data.accuratLetters;
			else collection = data.emmetLetters;
			
			for (var i = 0; i < collection.length; i++) if (collection[i].id == letterId) return collection[i];
		},
		
		
		getChapterById: function(dataType, chapterId)
		{
			var chapter = {};
			if (dataType == SymbolsService.dataAccurat)
			{
				var accuratChapter = data.chapterByAccuratId[chapterId];
				
				chapter.id = accuratChapter.aId;
				chapter.name = accuratChapter.aName;
			}
			else
			{
				var emmetChapter = data.chapterByEmmetId[chapterId];
				
				chapter.id = emmetChapter.eId;
				chapter.name = emmetChapter.eName;
			}
			
			return chapter;
		}
	};
}]);