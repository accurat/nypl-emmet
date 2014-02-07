#Emmet Collection Viz

##Description
This data visualization allows to explore the [Emmet Collection of the New York Public Library](http://archives.nypl.org/mss/927#overview)


##Data
The current data set is divided in 3 csv files. The 3 files are connected with a relationship like the following:

	letters (id) 1-* (letterId) associations (nameId) *-1 (id) names

The association link letters to authors or recipients.




##Technology
The visualization use [Angular](http://angularjs.org) for the main data operation like name search and switch between view. Use [D3](http://d3js.org) for the data visualization.



##Run
The app use [Bower](http://bower.io) as package manager (installation instructions on Bower's website).

Run the following command to download dependencies:
	
	bower install
	
Run any web server on the root directory of the project to use the app, python http server for eg:

	python -m SimpleHTTPServer