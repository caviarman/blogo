FROM golang
COPY . /go/src/blogo
RUN apt update -y && apt install -y nodejs && apt install -y npm
RUN go mod tidy
RUN npm install -g -y @angular/cli
RUN cd /go/src/blogo && make all
RUN go install blogo
ENTRYPOINT /go/bin/blogo
EXPOSE $PORT