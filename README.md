![mit](https://img.shields.io/badge/License-MIT-blue.svg)

# Biased and Inattentive Responding Drive Apparent Metacognitive Biases in Mental Health 
## Noam Sarna, Reuvan Dar, and Matan Mazor 

## Data 
Fully-anonymized experimental data is available [here](https://osf.io/6npd9/files/osfstorage). 

## Demos 
You can try the online experiment by clicking [here](https://noamsarna.github.io/BIRDAM/experiment/countDots/). 

## Analysis Scripts
A fully reproducible version analysis pipeline in RMD format is available 

## Pre-registration time-locking 🕝🔒 
To ensure preregistration time-locking (in other words, that preregistration preceded data collection), we employed [randomization-based preregistration](https://medium.com/@mazormatan/cryptographic-preregistration-from-newton-to-fmri-df0968377bb2). We used the SHA256 cryptographic hash function to translate our preregistered protocol folder (including the pre-registration document) to a string of 256 bits. These bits were then combined with the unique identifiers of single subjects, and the resulting string was used as seed for initializing the Mersenne Twister pseudorandom number generator prior to determining all random aspects of the experiment. This way, experimental randomization was causally dependent on, and therefore could not have been determined prior to, the specific contents of our preregistration document [(Mazor, Mazor & Mukamel, 2019)](https://onlinelibrary.wiley.com/doi/10.1111/ejn.14278).

## Experiment

[protocol folder]

**protocol sum**:
23aef7ab769eab2870a780b6b5c821e27782d3019b6bca0589aebecde086159e

[**Preregistration document from the protocol folder**]
