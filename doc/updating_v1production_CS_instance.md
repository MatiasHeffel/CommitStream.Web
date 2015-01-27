# Summary

* We use staged deployment to update the v1production CommitStream instance.
  * The production site address that v1produciton uses is http://v1cs-test.azurewebsites.net/.
  * This site is **not bound to source control**, intentionally, as you'll see below.
  * This site points to the VM **v1cs-dev-prod** (ignore the name confusion).
* The staging address is **http://v1cs-test-staging.azurewebsites.net/**
  * This site **is bound to source control** on this branch: [v1cs-dev-staging](https://github.com/openAgile/CommitStream.Web/tree/v1cs-dev-staging)
    * When you push code to this branch, it will update the web site.
    * **This site currently also points to the same VM as the production instance, so be careful with code that deals with projections.**
* To push from the staging site to the production site, click the **Swap** button on either the **v1cs-test** or the **v1cs-test(staging)" site.
  * This will swap the physical site code in the deployment slots, and both sites will remain running.
  
# Caveats

* Because we check for projections on the target EventStore instance, and then create them when they don't exist, we have to be careful about using the same EventStore instance. It will be better to create a separate VM for staging.
  * Also, because both slots remain running, if we remove a projection in a new deployment, that projection would get added back to the EventStore by the old site.
    
  
  
  
  
