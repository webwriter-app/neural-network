# Get started
In [WebWriter](https://run.webwriter.app), install the "Neural Network" package and click to insert.


## Usage outside of WebWriter
The project can be built for different platforms by using the premade vite build config. For this, run `vite build --config vite.config.js`. When using npm, the command can be executed with `npm run
create`. You can test the result either by using `npm run start` or by using a different tool for serving locally. Note that an index html file needs to be placed inside the dist folder for the project to
work properly in a browser. In general, make sure that you specify the correct paths to access the custom assets.



# Deep learning simulation for WebWriter

This widget adds a deep learning simulation to WebWriter. As a teacher, you can:

- choose from a number of preconfigured examples
- build a custom network topology
- create custom datasets
- customize training parameters
- test the trained model by predicting
- choose what options you want to give your students (ranging from allowing them to edit nearly everything you can up to providing them a 'view and explore'-only experience)
- provide students with help in a Q&A section

## State of the widget

### Bugs

- prediction for classification data sets results in NaN
- weights are falsely assigned during training for complex network structures containing layers with multiple incoming layers
- validation for creating data sets is missing at some parts
- when clicking on quick setup options, nothing happen
