## To build the image:
Open a terminal and navigate to the project root folder, run
```shell
docker build --tag image_name .
```
Or directly build using the docker desktop or IDE

## To run a container using the image:
Open a terminal, run
```shell
docker run -d -p 3000:3000 -p 4000:4000 -p 5432:5432 --env-file .env --name container_name image_name 
```
Or directly run using the docker desktop or IDE


## To run a container using the image using bind mounts:
## Bind mounts allow users to see changes to files without rebuilding the image

Open terminal, run 
```shell
docker run -d -p 3000:3000 -p 4000:4000 -p 5432:5432 --env-file .env -v "$(pwd):/app" --name container_name image_name
```

## To view errors and console.log()
Open terminal and run the following after building the container
The <container_id> will be outputted after running docker run or go to Docker Desktop to view it

```
docker logs -f <container_id>
```




## Using Docker-Compose: Building image and creating container
Open terminal and run
```
docker-compose up --build
```

## Removing containers
Open terminal and run 
```
docker-compose down
```
The alternative is to use Docker Desktop and manually delete

## Executing the docker-compose.yml file
If you do not want to rebuild the image and only want to create a container
Open terminal and run 
```
docker-compose up
```
