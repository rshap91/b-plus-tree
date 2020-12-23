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
- The only parameter is the _number of pointers in each node_. Each tree node except the root must have between N/2 And N pointers. Each node will hence have between (N-1)/2 and N-1 index key values.


### Tree Searching

- Starting at the root compare the search value to each value in the root node. 
  - If the search value is less than the ith value of a tree node, follow the ith pointer. 
  - If the search value is larger than every value in the tree node, follow the Nth (last) pointer.
- Repeat this for each tier of the tree as you follow the pointers until you get to a leaf node.
- When you get to the leaf nodes, scan the values in the node for the search value. 
  - If the ith node value equals the search value, the ith pointer will point to the table row containing it.

B+Tree Indexes are particularly good for queries that filter a table based on a range of values. The range will have a start and an end value. In this case find the pointers for the start value of the range and then read pointers sequentially in the index leaves until you reach a value that is greater than the end value.

They can also be used for LIKE clauses that use a constant string and don't start with a wildcard. A condition such as LIKE 'abc%' can use the B+tree to filter to all rows that start with abc. 


### Inserting

_Part 1. Inserting_

  - Traverse the tree using the insert value as the search value.
  - When you reach the leaf nodes, scan the node as you would any other node in the tree. 
  - If the ith value of the node is greater than the insert value, insert the new value and corresponding pointer at the ith position.
  - Otherwise append it to the end of the node.

If inserting the value into the node causes it to have too many pointers (greater than the tree parameter), then you must reblance the tree.

_Part 2. Rebalancing_

  - If the node has V values, split the node into two nodes such that the first V/2 values are in the first/left node, and the rest are in the second/right node.
  - The new splitting value is the first value in the right node. Add this value to the parent node and update its surrounding pointers to point to the two new nodes.
  - If adding this new splitting value to the parent cuases the parent to overflow (exceed the trees parameter), you must repeat the above steps.
    - Note that if you split a _non-leaf_ node, then the splitting value gets __moved__ to the parent, not __copied__ as it does when splitting leaf nodes.
  - Repeat the above either until inserting a value does not cause an overflow or until you reach the root of the tree. If inserting a value into the root node causes an overflow, you must split the root node into two nodes and create a new root node above it.


### Deleting

Deleting is more complicated than insertion as rebalancing the tree often requires accessing more nodes.

_Part 1. Deleting_

  - Search for the delete value in the tree and remove it. 
  - For each parent node in the search path, if the deleted value was in the node, you must update that value to the new splitting value of the child.


_Part 2. Rebalancing_

  - At this point it's possible for that node to be too small (less than n/2) or empty. 

_Part 2.1 Steal From Sibling

  - First, attempt to move a value from either sibling into the current node. 
    - Check the left sibling, and if possible move its largest value to the current node. 
    - If this would leave the left sibling with too few pointers, instead attempt to move the smallest number from the right sibling.
  - If you can steal a value from either sibling without violating the minimum you must then replace the corresponding splitting value in the parent.
    - If you took a value from the left sibling, this will be the value that was moved. If you took a value from the right sibling, it will be the new lowest value in the right sibling. 

_Part 2.2 Merge Nodes_

  - If you cannot steal a value from a sibling, you must merge the edited node with one of its siblings.
  - Once merged, you need to remove the splitting value and pointer from the parent node as you have one less node. 
  - If this leaves the parent node with two few pointers (or empty), repeat the steps for this node. Attempt to steal a value from a sibling, or merge. 
  - Repeat up the tree until it is balanced.


### Additional Info

  - O(Log_{n/2}(N)
  - Tree Parameter is usually quite large (100s+).
  - Because of the structure of the tree, the upper tiers are quite sparse and can be stored in memory. This reduces disk ops.




