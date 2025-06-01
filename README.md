# www-o-techno

Anyone who has been to Electromagnetic Field will be familiar with [World'o'Techno](https://github.com/jarkman/world-o-techno), a little robot that can be dragged around the site and plays techno according to its GPS coordinates. Back when EMF was cancelled due to COVID, I thought making this would be fun. Almost 5 years later it got to the top of my interesting projects list and I decided to take the opportunity to learn about the Web Audio API.

This is basically implemented by manually reimplementing the original Ruby code, while digging into the source code of Sonic Pi. I actually know nothing about music or its composition, so I learned a lot doing this. Honestly I don't even know if this is accurate since I couldn't get the original working in Docker, but it sounds very familiar.

Have fun seeing what techno you could hear in far reaches of the world!

# What's next

- Test it out against the original! I wonder if anyone has ever written unit tests comparing audio samples before.
- Maybe implement the beat you get when you don't have a GPS fix. It's kinda meaningless here, so it would only be for the sake of completion.

# Thanks

Thanks to @jarkman for the fun robot and fun code.
