[!WARNING]  
This widget is still in early development. Some features are not yet available. You may encounter bugs! See the list of not yet implemented features and bugs at the end of this README!

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
- when clicking on quick setup options, nothing happens

### Crucial features not yet implemented

- show weights (on edges)
- importing and exporting on non-chromium browsers

### Planned features

- explain the loss function
- allow choosing the number of training epochs
- allow seeing raw data
- allow hiding plots and raw data
