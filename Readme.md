# Order Fire Serve

This is a simple proof of concept inspired by the Linear App Architecture (See)[https://www.youtube.com/live/WxK11RsLqp4?feature=share&t=2175].

## Backend
The backend provides a simple REST Api that uses event sourcing to record all mutations.

Here are a few guidelines:
 * All operations should be idempotent. The API should use PUT/PATCH and not POST.
 * To simplify optimistic ui implementation ids can be client side generated. (UUID V7 is probably a good way to go)
 * The history needs to be linear (all mutations need to be strictly ordered).
   * This is guaranteed with a lock that needs to be acquired by all writing transactions
   * Each transactions knowns its predecessor. This could be used in the frontend to verify a complete history.
 
 ## Frontend
 The ui is a basic react app that uses mobx-state-tree to model the working copy of the backend state.
 
 The state manages all entities in collections separated by types.
 
 Each command is converted to the JsonPatch format.
 
 Local commands are immediately applied to the local state and stored in an UpdateQueue which executes commands one by one.
 
 To revoke a failed command. Simple recover the affected entity from the snapshotrepository and reapply local updates.
 
 To apply a remote command. Apply its patches and the reapply patches stored in the UpdateQueue.
 
 Here are a few guidelines:
  * All collections should use identifiers as keys (avoid arrays) to keep Patches idempotent.