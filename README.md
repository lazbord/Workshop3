### Practical Exercise: From Local to Decentralized Computation

**Q1:** Develop diverse predictive models targeting the selected dataset. Each group member should create a distinct model.

- Evaluate the accuracy and performance of your model.
- Adapt your model for API access. This API should include a GET `predict` route that accepts model arguments and returns a prediction.
- Determine a standardized API response format within your group.

Here is one of the flask route that we made
![image](https://github.com/lazbord/Workshop3/assets/144808507/b07ef698-c5bd-41b4-bcbf-3abc6070305c)  
![image](https://github.com/lazbord/Workshop3/assets/144808507/778acc80-7532-435b-b85a-8b893cd7b95f)  
Then we tried our flask applications.
![image](https://github.com/lazbord/Workshop3/assets/144808507/e48967ae-04bf-4b95-bc6b-d0250f657dcf)  

**Q2:** Generate a consensus prediction by averaging outputs from the group's models, using tools like ngrok for inter-computer connectivity. Assess the performance of this aggregated meta-model.
First we started ngrok 
![image](https://github.com/lazbord/Workshop3/assets/144808507/83c113a4-ed8f-4213-99c0-7f8174a8d6cb)  
And we tried our application on ngrok.  
![image](https://github.com/lazbord/Workshop3/assets/144808507/bb003340-b57b-4f2c-8fc0-f1b6c5dd12eb)  

When all the applications were running on ngrok, we made a python code to compare everyone results.  
![image](https://github.com/lazbord/Workshop3/assets/144808507/a996c867-e80f-473d-b75e-20b5455671f0)  

