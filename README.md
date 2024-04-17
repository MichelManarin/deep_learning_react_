
See it live:
https://deeplearningreact-production.up.railway.app/

How use:
https://www.youtube.com/watch?v=j6mHSzsyU2Q

Hello, I did some changes to the API structure, adjusting the routes, separating the responsabilities and opting to send the frame as base64. Although I didn't implement a storage solution for saving images, but it would be a good addition, because storing images would allow to display frames in the historical page. I couldn't focus on testing solutions mainly on the frontend. Its necessary to say i used a personal project as a boilterplate in the front, so, there have some tests but not relative with the main feature, and I thing its necessary to ensure the reliability. Its necessary improve the some validation too like the form on the video page and manager possible errors coming from the api using the validation on the props.

I tried to use the package ffmpeg to get the frame without a auto play but i had some security issues on the railway, so, i changed to use a simple package thats require a autoplay on vídeo. For this reason I chose to not do a real time application, but i thing is a good challenge, to handling problems with latency, maybe find some way to not do the insert data into dabatase together with detection. I'm not sure if a event processing could be help on this way, dicrease the latency, let me know what is better on this. 

My deadline is today, but if I can continue improving the project just let me know. I made the history page as simple as possible to focusing on the main feature.

I welcome any feedback or suggestions for improvement


