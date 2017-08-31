from __future__ import print_function
import argparse
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
import torchvision
from torchvision import datasets, transforms
from torch.autograd import Variable

#ConvNet Model
class ConvNet(nn.Module):
    def __init__(self, layers):
        super(ConvNet, self).__init__()
        self.layer_modules, self.batch_norms, self.act_modules = self.parse_layers(layers)

        # add modules to convnet object
        for i in range(len(self.layer_modules)):
            self.add_module("layer"+str(i), self.layer_modules[i])
            if self.batch_norms[i] is not None:
                self.add_module("bn"+str(i), self.batch_norms[i])

        self.init_weights()

    def forward(self, x):
        # Loop through all convlutional/pooling layers
        for m in range(len(self.layer_modules)):
            classname = self.layer_modules[m].__class__.__name__

            # convolutional or pooling layer
            if classname.find('Conv') != -1:
                x = self.layer_modules[m](x)
            elif classname.find('Pool') != -1:
                x = self.layer_modules[m](x)
            elif classname.find('Linear') != -1:
                x = x.view(-1, self.layer_modules[m].in_features)
                x = self.layer_modules[m](x)

            # batch normalization
            if self.batch_norms[m] is not None:
                x = self.batch_norms[m](x)
            # activation
            if self.act_modules[m] is not None:
                x = self.act_modules[m](x)
        return x

    def init_weights(self):
        # initializes all weights to uniform distribution between -0.1 and 0.1
        # all biases initialized to 0
        init_range = 0.1
        for mod in self.layer_modules:
            try:
                mod.weight.data.uniform_(-init_range, init_range)
                mod.bias.data.fill_(0)
            except:
                pass

    def parse_layers(self, layers):
        # Takes layers argument and creates corresponding model
        # layer types: convf (padding), convv (no padding), maxpool, fc
        # arguments: layer-type, filters, kernel, batch-normalization bool, activation

        # e.g. layers = [["convf", 32, 5, True, "lrelu"], ["maxpool", 0, 2, True, "lrelu"],
        #         ['fc',10,0,False,''], ["convv", 128, 3, True, "lrelu"]]

        self.layers = layers
        channels = [1]
        layer_modules = {}
        act_modules = {}
        bn_modules = {}
        input_dim = [###DIMENSION###]
        filter_count = []

        flattened_size = 1

        for l, layer in enumerate(layers):
            layer_type, filters, kernel, bn, act = layer

            # Find layer type and create convolutional / pooling objects
            if layer_type in ["convf", "convv"]:
                if layer_type == "convv":
                    mod = nn.Conv2d(channels[-1], filters, kernel, stride=1, padding=0, dilation=1, groups=1, bias=True)
                    input_dim.append(input_dim[-1]-kernel+1)
                else:
                    mod = nn.Conv2d(channels[-1], filters, kernel, stride=1, padding=kernel-1, dilation=1, groups=1, bias=True)
                    input_dim.append(input_dim[-1]-kernel+1+2*(kernel-1))
                flattened_size = filters * input_dim[-1] * input_dim[-1]
                channels.append(filters)
                filter_count.append(filters)
            elif layer_type in ["maxpool"]:
                mod = nn.MaxPool2d(kernel, stride=None, padding=0, dilation=1, return_indices=False, ceil_mode=False)
                input_dim.append(input_dim[-1] / kernel)
                flattened_size /= (kernel * kernel)
            elif layer_type in ["fc"]:
                out_sz = filters
                mod = nn.Linear(flattened_size,out_sz)
                flattened_size = out_sz
            else:
                raise ValueError("Invalid layer type")
            layer_modules[l] = mod

            # Batcn normalization module if True
            if bn:
                bnmod = nn.BatchNorm2d(filter_count[-1], eps=1e-05, momentum=0.1, affine=True)
            else:
                bnmod = None
            bn_modules[l] = bnmod

            # Activation function
            if act == "relu":
                actmod = F.relu
            elif act == "lrelu":
                actmod = F.leaky_relu
            else:
                actmod = None
            act_modules[l] = actmod


        # Set the total number of parameters after convolution layers (for fc layers)
        self.flat_count = int(filter_count[-1]*input_dim[-1]*input_dim[-1])
        return layer_modules, bn_modules, act_modules



# Training settings
parser = argparse.ArgumentParser(description='PyTorch MNIST Example')
parser.add_argument('--batch-size', type=int, default=50, metavar='N',
                    help='input batch size for training (default: 64)')
parser.add_argument('--epochs', type=int, default=###EPOCHS###, metavar='N',
                    help='number of epochs to train (default: ###EPOCHS###)')
parser.add_argument('--lr', type=float, default=###LR###, metavar='LR',
                    help='learning rate (default: ###LR###)')
parser.add_argument('--weight_decay', type=float, default=###WEIGHT_DECAY###, metavar='WD',
                    help='weight decay (default: ###WEIGHT_DECAY###)')
parser.add_argument('--momentum', type=float, default=0.5, metavar='M',
                    help='SGD momentum (default: 0.5)')
parser.add_argument('--no-cuda', action='store_true', default=False,
                    help='enables CUDA training')
parser.add_argument('--seed', type=int, default=1, metavar='S',
                    help='random seed (default: 1)')
parser.add_argument('--log-interval', type=int, default=2000, metavar='N',
                    help='how many batches to wait before logging training status')

args = parser.parse_args()
args.cuda = not args.no_cuda and torch.cuda.is_available()

torch.manual_seed(args.seed)
if args.cuda:
    torch.cuda.manual_seed(args.seed)

kwargs = {'num_workers': 1, 'pin_memory': True} if args.cuda else {}

#Dataloading
print('Loading Data!')

transform = transforms.Compose(
    [transforms.ToTensor(), transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))]
)

trainset = torchvision.datasets.MNIST(root='./mnist', download=True, train=True, transform=transform)
train_loader = torch.utils.data.DataLoader(trainset, batch_size=4, shuffle=True, num_workers=2)

testset = torchvision.datasets.MNIST(root='./mnist', download=True, train=False, transform=transform)
test_loader = torch.utils.data.DataLoader(testset, shuffle=False, batch_size=4, num_workers=2)

print("Data loaded!")

# layer arguments: layer-type, filter-count, kernel-size, batch-normalization-boolean, activation
#layers = [["convv", 32, 5, False, ""], ["maxpool", 0, 2, True, "lrelu"], ["convv", 64, 3, True, "lrelu"], ["convv", 64, 3, False, ""],
#         ["maxpool", 0, 2, True, "lrelu"], ["convv", 128, 3, True, "lrelu"]]
#
#conv - nfilters,kernel,batch-norm-boolean, activation
#maxpool - <not used>,kernel,batch-norm-boolean, activation
#fc - output,<not used>,batch-norm-boolean,<not used>

layers = ###LAYERS###

model = ConvNet(layers)

if args.cuda:
    model.cuda()

#optimizer
optimizer = optim.Adam(model.parameters(), lr=args.lr, weight_decay=args.weight_decay)

#Loss function
criterion = nn.CrossEntropyLoss()

def test():
    model.eval()
    total, correct = 0, 0
    for data in test_loader:
        images, labels = data
        outputs = model(Variable(images))
        _, predicted = torch.max(outputs.data, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum()

    print('Test data accuracy: %d %%  ' % (100 * correct / total))

# training
model.train()
best_loss = 10.0
for epoch in range(1, args.epochs + 1):
    training_loss = 0.0
    for i, data in enumerate(train_loader, 1):
        inputs, labels = data
        inputs, labels = Variable(inputs), Variable(labels)
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        training_loss += loss.data[0]
        if i % args.log_interval == 0:
            training_loss /= (args.log_interval * 1.0)
            print('Epoch: %s, Batch: %d, Training Loss: %.5f' %(epoch, i, training_loss))
            if training_loss < best_loss:
                best_loss = training_loss
                torch.save(model.state_dict(), 'model.pth')
            training_loss = 0.0

#test
test()
