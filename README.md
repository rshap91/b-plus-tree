### Intro

A react app implementation of a B+Tree index.
Nodes have pointers (grey) and values (white)



- B +Tree is used for database table indexes (among other things). 
- Each level (other than the root) contains multiple nodes
- Each node contains multiple index-key values and pointers
	- The pointers to the leaf nodes are to the corresponding rows in the table
- The tree is balanced - all paths from root to each leaf are the same length.



- Leaf Nodes are a dense index on the tables index-key values.
- each tier above that is a sparse index on the tier below
	- sparse indexes are partial indexes, instead of pointing to a row exactly, they point to the start of a range of rows where the value would be found.
- The only parameter is the _number of pointers in each node_. Each tree node will have no more than N pointers and N-1 values.

### Tree Searching

- Starting at the root compare the search value to each value in the root node. 
  - If the search value is less than the ith value of a tree node, follow the ith pointer. 
  - If the search value is larger than every value in the tree node, follow the Nth (last) pointer.
- Repeat this for each tier of the tree as you follow the pointers until you get to a leaf node.
- When you get to the leaf nodes, scan the values in the node for the search value. 
  - If the ith node value equals the search value, the ith pointer will point to the table row containing it.


### Inserting
 - 
